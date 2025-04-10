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

## 6. ERD
<img src="/uploads/8a42b369535cb05dbb87150afa2648ba/image.png" width=2000 height=auto>

## 7. 시연 영상


## 8. 팀 구성원 및 역할
|이름|역할|
|--- |---|
|권기범(Infra&AI)| 여기<br>쓰기 |
|김민경(BE)| 여기<br>쓰기 |
|남우재(BE)| 여기<br>쓰기 |
|이길호(FE)| 여기<br>쓰기 |
|이송민(FE)| 여기<br>쓰기 |
|조다민(Infra&AI)|  여기<br>쓰기 |

## 9. 마무리 회고
|이름|회고|
|---|---|
|권기범| 여기<br>쓰기 |
|김민경| 여기<br>쓰기 |
|남우재| 여기<br>쓰기 |
|이길호| 여기<br>쓰기 |
|이송민| 여기<br>쓰기 |
|조다민| 여기<br>쓰기 |
