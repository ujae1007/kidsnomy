# :dollar: Kidsnomy - 체험형 금융 교육 플랫폼

<img src="./Frontend/src/assets/kidsnomy_logo.png" width=300 height=auto>

## 목차
[1. 서비스 소개](#1-서비스-소개)

[2. 기능 소개](#2-기능-소개)

[3. 주요기능 상세소개](#3-주요기능-상세소개)

[4. 기술 스택](#4-기술-스택) 

[5. 시스템 아키텍쳐](#5-시스템-아키텍쳐)

[6. ERD](#6-erd)

[7. 시연 영상](#7-시연-영상)

[8. 팀 구성원 및 역할](#8-팀-구성원-및-역할)

[9. 마무리 회고](#9-마무리-회고)

---
## 카테고리

| Application | Domain | Language | Framework | Infra |
| ---- | ---- | ---- | ---- | ---- |
| :white_check_mark: Desktop Web | :white_check_mark: Fintech | :black_square_button: JavaScript | :black_square_button: Vue.js | :white_check_mark: Docker |
| :white_check_mark: Mobile Web | :black_square_button: AI | :white_check_mark: TypeScript | :white_check_mark: React | :white_check_mark: Gitlab CI/CD |
| :white_check_mark: Responsive Web | :black_square_button: Big Data | :black_square_button: C/C++ | :black_square_button: Angular | |
| :black_square_button: Android App | :black_square_button: Blockchain | :black_square_button: C# | :white_check_mark: Node.js | |
| :black_square_button: iOS App | :black_square_button: IoT | :white_check_mark: Python | :black_square_button: Flask/Django | |
| :black_square_button: Desktop App | :black_square_button: AR/VR/Metaverse | :white_check_mark: Java | :white_check_mark: Spring/Springboot | |
| | | :black_square_button: Kotlin | :white_check_mark: FastAPI | |

## 프로젝트 기간
> ✅ 25.02.24 ~ 25.04.11 (총 7주)

## 1. 서비스 소개
```
아이와 부모가 함께하는 체험형 금융 교육 플랫폼
부모와 아이가 고용주와 피고용주 역할로 참여해 경제와 금융의 기본 개념을 학습
아이가 직접 금융 상품을 체험하며 건강한 금융 습관과 책임감 배양
```
### 1) 기획 배경
국내 청소년들을 대상으로 실시한 금융 이해력 조사 결과에 따르면, 평균 점수가 기준점인 60점에 미치지 못하고 46.8점에 그치는 것으로 나타났습니다.

조사한 결과, 청소년기에 받은 경제교육이 실제 경제 활동에 큰 도움이 되며, 특히 체험 위주의 교육 방식이 더욱 효과적인 것으로 확인되었습니다.

이러한 배경을 바탕으로, 어린 시절부터 가정 내에서 자연스럽게 경제 교육을 받을 수 있는 서비스를 기획하게 되었습니다.

## 2. 기능 소개
### 1) 그룹 관리
- 원하는 멤버로 그룹을 구성해보세요.
- 그룹을 통해 구성원을 관리할 수 있습니다.
- 그룹 내 어른들만 아이들에게 일자리, 금융상품을 제공할 수 있습니다.
- 어른들은 여러 그룹에 속할 수 있습니다.

### 2) 계좌 관리
- 사용자 별로 개인의 계좌를 생성합니다.
- 기본 계좌는 하나만 생성 가능하며, 각 상품별로 별도의 계좌가 생성됩니다.

### 3) 일자리 관리
- 그룹내 어른들이 생성한 일자리를 아이들에게 제공할 수 있습니다.
- 일자리의 속성(제목, 내용, 급여, 기간, 추가보상, 매일 초기화 여부)을 설정해서 생성할 수 있습니다.
- 아이는 생성된 일자리를 계약을 통해 수행할 수 있습니다.
- ( 생성 -> 계약 -> 수행 완료 -> 완료 승인 ) 의 프로세스로 진행됩니다.
- 완료 승인과 동시에 일자리 **생성자**(어른)의 계좌에서 **계약자**(자녀)의 계좌로 설정된 급여 만큼 자동이체가 이루어집니다.

### 4) 금융 상품 관리
- 그룹내 어른들이 생성한 예금, 적금 상품들을 아이들에게 제공할 수 있습니다.
- 금융 상품의 속성(제목, 내용, 예/적금, 이자율, 이자 지급 기간, 만기일)을 설정해서 생성할 수 있습니다.
- 아이는 생성된 금융 상품중 선택해 계약할 수 있습니다.
- ( 생성 -> 계약 -> 만기 ) 의 프로세스로 진행됩니다.
- 설정된 이자 지급 기간마다 부모의 계좌에서 아이의 해당 금융 상품 계좌로 설정된 이자만큼 자동이체 됩니다.
- 금융 상품 만기시 해당 상품 계좌에서 아이의 계좌로 자동이체 됩니다.

### 5) 소비 리포트 및 챗봇
- 아이의 소비 리포트 및 또래 아이들의 소비습관 정보를 제공합니다.
- 어른이 일자리 생성시 자녀에게 어울리는 **일자리**(행동)을 챗봇을 통해 추천받을 수 있습니다.

## 3. 주요기능 상세소개
### 1) 챗봇 (RAG)
    아이에게 적절한 업무 및 보상 금액 책정에 조언을 제공합니다.
#### 구성 요소
- perplexity를 활용해 아이에게 알맞은 일자리와 관련된 문서를 수집 및 정제
- **데이터**  (총 129개의 문서)
    - 국가 기관의 청소년건강행태조사
    - 전문가 칼럼
    - 교육 기관의 교육계획안
    - 학부모들의 블로그 글
    - 육아 잡지
    - 육아 도서
    - 관련 논문
- **정제**
    - 서비스 타겟 사용자의 나이대(10~15세)가 아님
    - 데이터의 내용이 현저히 작음(100자 이하)
    - 데이터 내용이 대부분 이미지 태그인 경우 제거
- **응답 전략**
    - 검색된 문서의 유사도가 임계값 이하일 경우 활동과 연관된 응답이 아니라고 판단
        - 페르소나는 유지하며 일반적인 대답을 할 수 있는 시스템 프롬프트 적용
    - 검색된 문서의 유사도가 임계값 이상일 경우 활동에 관한 응답이라고 판단
        - 문서를 바탕으로 입력에 맞는 활동을 추천
- **VectorDB** : Chroma DB
    - 간단한 초기설정 및 빠른 벡터 임베딩
    - 기본적인 내장 기능을 통한 편리한 사용
    - LLM 프레임워크와의 연동 용이
    - 빠른 검색속도 및 높은 유지보수성

### 2) 소비 리포트 (Visualization | Classification)
    아이의 올바른 금융습관을 기르기 위해 학습한 모델을 통해 아이의 소비내역 분석 결과를 제공합니다.
#### 구성 요소
- 목표 : 소비 분석을 하는 데 필수적인 카테고리의 분류에 사용
- 모델 : koBERT (Fine-Tuning)
- 데이터
    - kakao map API를 기반으로 얻은 카테고리 데이터
    - 96,284개의 데이터를 서비스에서 원하는 카테고리로 라벨링
    - 카테고리
        ```
        [교육, 의료, 취미, 식비, 카페/간식, 쇼핑, 문구, 미용, 문화, 도서, 생활, 교통]
        ```
    - 예시
        ```
        {
            "category_name": "음식점 > 간식 > 제과,베이커리",
            "place_name": "런던베이글뮤지엄 잠실점",
            "road_address_name": "서울 송파구 올림픽로 300"
        }
        ```

## 4. 기술 스택

<table>
  <tr>
    <th>프론트엔드</th>
    <td>
      <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
      <img src="https://img.shields.io/badge/Redux-764ABC.svg?style=flat-square&logo=redux&logoColor=white"/>
      <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
      <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/>
      <img src="https://img.shields.io/badge/typescript CSS-3178C6?style=flat-square&logo=typescript CSS&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th>백엔드</th>
    <td>
      <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=SpringBoot&logoColor=white"/>
      <img src="https://img.shields.io/badge/springsecurity-6DB33F?style=flat-square&logo=springsecurity&logoColor=white"/>
      <img src="https://img.shields.io/badge/FastAPI-009688.svg?style=flat-square&logo=fastapi&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th>데이터베이스</th>
    <td>
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
      <img src="https://img.shields.io/badge/ChromaDB-009688.svg?style=flat-square"/>
    </td>
  </tr>
  <tr>
    <th>웹서버</th>
    <td>
      <img src="https://img.shields.io/badge/Nginx-009639.svg?style=flat-square&logo=nginx&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th>AI</th>
    <td>
      <img src="https://img.shields.io/badge/Langchain-1C3C3C.svg?style=flat-square&logo=Langchain&logoColor=white"/>
      <img src="https://img.shields.io/badge/huggingface-FFD21E.svg?style=flat-square&logo=huggingface&logoColor=white"/>
      <img src="https://img.shields.io/badge/pytorch-EE4C2C.svg?style=flat-square&logo=pytorch&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th>Infra 및 배포</th>
    <td>
      <img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat-square&logo=docker&logoColor=white"/>
      <img src="https://img.shields.io/badge/Jenkins-D24939.svg?style=flat-square&logo=jenkins&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th>Tools</th>
    <td>
      <img 
        src="https://img.shields.io/badge/Notion-000000.svg?style=flat-square&logo=notion&logoColor=white" 
        alt="Notion Badge"
      />
      <img 
        src="https://img.shields.io/badge/GitLab-FC6D26.svg?style=flat-square&logo=gitlab&logoColor=white" 
        alt="GitLab Badge"
      />
      <img 
        src="https://img.shields.io/badge/Jira-0052CC.svg?style=flat-square&logo=jira&logoColor=white" 
        alt="Jira Badge"
      />
    </td>
  </tr>
</table>

## 5. 시스템 아키텍쳐
<img src="/uploads/a4756d1939ade94ff2587e42457d9bcd/Web_App_Reference_Architecture.png" width=750 height=auto>

## 6. ERD
<img src="/uploads/8a42b369535cb05dbb87150afa2648ba/image.png" width=750 height=auto>

## 7. 시연 영상
### 1) 그룹 기능
![그룹 기능 영상](/uploads/f7ebb93887c622345454836a7df02b84/ezgif-4c64dd1e24d14a.gif)
### 2) 일자리 기능
![일자리 기능 영상](/uploads/317409d5010c1b8ebb6d7f3987e80f76/ezgif-4da8dac1e0848a.gif)
### 3) 챗봇 기능
![챗봇 기능 영상](/uploads/fac520002743a27cefcf516fbc048dbf/ezgif-4c18fdb8be0545.gif)
### 4) 금융 상품 기능
![금융 상품 기능 영상](/uploads/f8c5065cd701dee53b467103499e37e3/ezgif-42a7e782f1e348.gif)
### 5) 금융 리포트 기능
![금융 리포트 기능 영상](/uploads/97453c197cb3960615912049bc700a21/ezgif-4737831aeb3383.gif)

## 8. 팀 구성원 및 역할
|이름|역할|
|--- |---|
|권기범(Infra&AI)| **팀장**<br>- Jira / Git 관리<br>- GitFlow 적용<br>**Infra**<br>- Docker 환경 구축 (image tag 방식 정의)<br>- Jenkins pipeline 구축<br>**AI**<br>- RAG 챗봇 구현<br>- BERT fine-tuning 보조<br>- FastAPI 기반 AI 서빙 서버 구축<br>**ETC.**<br>- Frontend 보조<br>- 영상 포트폴리오 제작 |
|김민경(BE)| - 외부 API 고려한 금융상품 만기, 자동이체 트랜잭션 설계 <br> - API 호출 시 사용자 식별 및 인증 처리 <br> - 금융 상품, 계좌 및 거래 내역 기능 CRUD <br> - Spring을 통한 MySQL 스케쥴링 <br> - Kidsnomy 서비스와 외부 금융망 API 연동 <br> - 발표 및 PPT 총괄 <br> - Jira를 통한 협업 |
|남우재(BE)| - spring security + jwt를 활용한 회원가입 및 인증/인가 구현 <br> - email 인증 처리 <br> - Spring을 통한 MySQL 스케쥴링 <br> - 사용자, 그룹, 일자리, 리포트 기능 CRUD <br> - Spring <-> Fast API 연동 <br> - Kidsnomy 서비스와 외부 금융망 API 연동 <br> - 발표 장표 제작 및 시연 <br> - Jira를 통한 협업|
|이길호(FE)| **협업**<br>- Jira를 통한 협업<br>- 발표 자료 제작 및 발표 보조<br> **Frontend**<br>- UI/UX 설계 총괄<br>- Redux Persist를 활용한 상태 관리<br>- API Call 유틸 함수 설계 및 적용을 통한 API 연동<br>- API 응답 데이터의 정제 및 시각화 로직을 총괄 설계<br>- 순환 참조 문제 해결을 위한 store 구조 분할 설계<br>- 페이지 라우팅 및 역할 기반 접근 제어 구현<br>- 부모/자녀 구분 로직 처리 및 각 역할별 페이지 구현<br> **ETC.**<br>- Docker 기반 개발 환경 일부 구축<br>- Spring API 디버깅 보조 |
|이송민(FE)| - 피그마 목업 디자인 <br> - api 연결 보조 <br> - 발표 자료 제작 <br> - Jira를 통한 협업|
|조다민(Infra&AI)| - koBERT 모델 파인튜닝을 통한 소비 리포트 가게 카테고리 분류 <br> - CI/CD 보조 <br> - Jira 관리 |

## 9. 마무리 회고
|이름|회고|
|---|---|
|권기범| SSAFY에서 처음으로 팀장을 하면서 일정, 역할과 같은 여러 관리들을 해보는 경혐을 했습니다. 처음이라 부족한 점도 많았지만 어떤 식으로 프로젝트에 대한 관리를 할지 고민하고 성장하는 시간이었습니다. <br>기술적으로는 EC2에 AI 기능을 배포해보는 경험을 했습니다. 이 때 vector DB를 구축하는 데 생길 수 있는 문제에 대해서 알게 되었고, 배포 환경의 자원을 고려하면서 개발에 임할 수 있었습니다. |
|김민경|지치고 힘들 때마다 믿어주고 응원해 준 팀원들 덕분에 프로젝트 완성까지 완주할 수 있었습니다. 팀원 각 구성원과 7주간 함께하며 많이 배우고 성장할 수 있었습니다. <br> 이번 프로젝트에서 RESTful 설계와 외부 시스템 연동, 데이터 흐름 통합 등 다양한 기술적 과제를 성공적으로 해결하며 서비스의 완성도를 높였습니다. <br> 예·적금 트랜잭션을 고려해 외부 API와의 연동 방안 고려하고, 서비스 플로우에 따라 어떤 데이터를 주고받아야 하는지 고민해 본 경험 모두 기술적 역량을 키우는 데 큰 도움이 되었습니다. 앞으로는 초기 설계 단계에서 공통 모듈화와 예외 처리 로직을 더 철저히 계획하여 개발 속도와 품질을 동시에 높이는 데 집중할 계획입니다. 또한, RESTful 설계 원칙을 준수하면서도 외부 시스템 제약 조건을 더 꼼꼼히 분석하고 이를 서비스 설계에 적극 반영해 보겠습니다.|
|남우재|처음으로 백엔드 파트 리더를 맡아서 개발을 진행했습니다. JWT와 이메일 인증 부분은 처음 접해봤는데, 어려웠지만 강의를 참고하며 성공적으로 구현할 수 있었습니다. <br> Docker와 관련된 부분에 대해 많이 배웠는데, 코드 작성부터 관련 명령어까지 다양한 측면에서 이해가 깊어졌습니다. 또한 백엔드 파트에서 대부분의 문서 작업을 담당하면서 프론트엔드-인프라-백엔드-FastAPI와 같은 전체적인 프로세스를 이해하는 데 큰 도움이 되었습니다. <br> 기술적 도전으로는 우리 서비스와 외부 금융망 API를 연동하는 작업이 있었습니다. 특히 프론트엔드에서 우리 서버 호출과 동시에 외부 API 호출 시 관련 정보를 동기화하는 부분이 까다로웠지만 해결해낼 수 있었습니다. 프로젝트를 마무리하고 보니, 오류 처리를 열심히 했음에도 생각지 못한 부분에서 추가로 다듬어야 할 요소들이 많았습니다. 이를 통해 더 철저한 예외 처리의 중요성을 깨달았습니다.|
|이길호|이번 프로젝트는 단순한 화면 구현을 넘어, **프론트엔드 아키텍처 전반에 대한 깊은 이해**를 요구하는 작업이었습니다. <br> 가장 기억에 남는 부분은 **Redux Persist와 API Call을 연계하여 프로젝트의 상태 흐름과 인증 로직을 통일성 있게 구성**한 경험입니다. <br> 이를 통해 상태 관리와 인증 흐름을 체계적으로 설계할 수 있었고, 보다 실무적인 감각을 익힐 수 있었습니다. <br> 또한, **순환 참조 문제를 해결하기 위해 store 구조를 분리하고**, **memoization 문제를 방지하기 위해 Redux를 모듈 단위로 분리**하며 아키텍처에 대한 깊은 고민과 함께 설계 역량을 키울 수 있었습니다. <br> 도커 환경에서는 React 앱이 정상 실행되지 않는 이슈가 있었는데, 해당 문제를 직접 디버깅하면서 **Docker 실행 환경에 대한 이해도 함께 높일 수 있는 좋은 기회**가 되었습니다. <br> Spring 기반의 백엔드 코드와 API 연동 과정에서도 일부 디버깅을 직접 경험하며, **프론트엔드-백엔드 간 연결 구조에 대한 명확한 이해**를 얻을 수 있었습니다. <br> 프론트엔드 리더로서 팀원들과 함께 전반적인 FE 로직 설계를 주도하며, **설계, 구조화, 협업, 디버깅 등 전방위적인 프론트엔드 역량을 폭넓게 경험**할 수 있었고, 또한 팀원들에게 제 지식을 공유하며 **스스로의 지식도 되돌아보고 더 깊이 있게 다질 수 있는 성장의 계기**가 되었습니다. <br> 이번 프로젝트는 저에게 있어 **'성장' 그 자체**였습니다. 프론트엔드의 단순 구현을 넘어, **설계부터 구조화, 협업, 디버깅까지** 모든 과정을 아우른 값진 시간이었습니다.|
|이송민| 프론트에 대한 이해가 올라갔다. api를 연결하고 로직을 짜는 방법을 배워서 프론트 엔드 전반에 대한 이해가 올라갔다 완벽하지는 않지만 성장했다.<br>다음 프로젝트에서도 더욱 성장하고 다음에는 주도적으로 프로젝트를 이끌어 가고 싶다. 그리고 다음에는 백을 담당해서 프로젝트 전반에 대한 이해를 높이고 싶다. |
|조다민|프로젝트 진행하면서 React API 연결이나 Jenkins 등 처음 접해보는 것도 있고, Docker나 AI 모델 활용 등 이전에 했던 것들이라도 더 깊게 들어가서 여러모로 배운 것들이 많아 유익한 도움이 되었습니다. |
