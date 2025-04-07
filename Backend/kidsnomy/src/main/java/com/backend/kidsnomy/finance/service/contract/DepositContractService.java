package com.backend.kidsnomy.finance.service.contract;

import com.backend.kidsnomy.basic.exception.AccountCreationException;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.dto.DepositContractRequestDto;
import com.backend.kidsnomy.finance.entity.Deposit;
import com.backend.kidsnomy.finance.entity.DepositContract;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import com.backend.kidsnomy.finance.repository.DepositContractRepository;
import com.backend.kidsnomy.finance.repository.DepositRepository;
import com.backend.kidsnomy.group.entity.GroupMembership;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class DepositContractService {

    private final BasicProductRepository basicProductRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final DepositRepository depositRepository;
    private final DepositContractRepository depositContractRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;

    private String apiKey;
    private String baseUrl;

    public DepositContractService(BasicProductRepository basicProductRepository,
                                  BasicAccountRepository basicAccountRepository,
                                  DepositRepository depositRepository,
                                  DepositContractRepository depositContractRepository,
                                  GroupMembershipRepository groupMembershipRepository,
                                  UserRepository userRepository,
                                  RestTemplate restTemplate,
                                  JwtTokenProvider jwtTokenProvider,
                                  UserKeyService userKeyService,
                                  @Value("${ssafy.api.apiKey}") String apiKey,
                                  @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicProductRepository = basicProductRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.depositRepository = depositRepository;
        this.depositContractRepository = depositContractRepository;
        this.groupMembershipRepository = groupMembershipRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // 예금 계좌 생성
    @Transactional
    public void createDepositContract(Long productId,
                                      DepositContractRequestDto requestDto,
                                      HttpServletRequest request) {

        // JWT 인증 처리
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 이메일 → userId 추출
        String email = jwtTokenProvider.getEmailFromToken(token);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
                .getId();

        // 기본 상품(accountTypeUniqueNo) 조회
        String accountTypeUniqueNo = basicProductRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new AccountCreationException("기본 수시입출금 상품이 존재하지 않습니다."))
                .getAccountTypeUniqueNo();

        // 수시입출금 계좌 조회 → 기본 계좌가 존재해야 상품 만기 시 자동 이체 가능
        if (!basicAccountRepository.existsByUserId(userId)) {
            throw new NoBasicAccountException("수시입출금 계좌가 필요합니다. 먼저 기본 계좌를 생성해주세요.");
        }

        // 사용자의 groupId 조회
        GroupMembership groupMembership = groupMembershipRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("사용자의 그룹 정보를 찾을 수 없습니다."));
        Long groupId = groupMembership.getGroupId();

        // 예금 상품 productId 조회
        Deposit deposit = depositRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("예금 상품을 찾을 수 없습니다."));

        // 예금 상품 중복 계약 확인
        if (depositContractRepository.existsByDepositIdAndUserId(productId, userId)) {
            throw new IllegalArgumentException("이미 해당 상품에 가입하셨습니다.");
        }

        // 예금 만기일 계산 (주 단위)
        LocalDateTime startDay = LocalDateTime.now();
        LocalDateTime endDay = startDay.plusWeeks(deposit.getDueDate());

        // 외부 API 요청 데이터 구성
        String userKey = userKeyService.getUserKeyByEmail(email);
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountTypeUniqueNo", accountTypeUniqueNo);

        try {
            // 5. 외부 API 호출
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            // 6. 응답 처리
            if (response == null || !response.containsKey("REC")) {
                throw new IllegalStateException("계좌 생성 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String accountNo = Optional.ofNullable((String) rec.get("accountNo"))
                    .orElseThrow(() -> new IllegalStateException("계좌번호 정보가 없습니다."));

            // 7. 계약 정보 저장
            DepositContract contract = new DepositContract();
            contract.setGroupId(groupId);
            contract.setUserId(userId);
//            contract.setProductId(deposit.getId());
            contract.setStartDay(LocalDateTime.now());
            contract.setEndDay(endDay);
            contract.setAccountNo(accountNo);
            contract.setBalance(requestDto.getBalance());
            contract.setTotalVolume(requestDto.getBalance());
            contract.setStatus(0); // 기본값: 활성 상태
            contract.setDeposit(deposit);

            depositContractRepository.save(contract);

        } catch (HttpClientErrorException e) {
            throw new IllegalStateException("SSAFY API 호출 실패: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new IllegalStateException("계좌 생성 중 오류 발생: " + e.getMessage());
        }
    }
}
