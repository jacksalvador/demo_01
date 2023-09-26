# 첫번째 데모 준비

# Getting Started

# Demo

프론트 엔드가 있는 배치 서비스

기능 1
목적지를 입력하면 좌표로 변경

기능 2
좌표로 이동 가능 시간대에 경로 예측 시간 데이터 수집 (오전 6시 - 오후 10시 한 주 앞뒤로 수집)

# 인프라

FE - S3 프론트엔드 웹 호스팅
BE - Node.js (JavaScript 런타임) Lambda or EKS
DB - DynamoDB or S3

# 어플리케이션 설명

## Why

주말에 운전을 해서 어디로 놀러 가도 붐빈다
평일 주말 가릴 것 없이 도로가 막히기에
차에 갇혀 있는 시간이 너무나 아깝게 느껴져서
가장 붐비지 않는 시간대를 찾고 싶다

## how

네비게이션 기능을 제공하는 API를 사용하여 목적지까지의 예상시간을 수집한다
네이버와는 달리 티맵 같은 경우 사용한도는 존재하지만 **무료**로 제공하고 있고
**타임머신경로안내**(미래의 시간을 지정할 경우 목적지까지 예상시간 제공) 기능까지 제공하고 있다

### 티맵 무료 계정 API 사용한도

![api_quota_1](https://github.com/jacksalvador/demo_01/assets/26760684/cff04448-382c-4d24-b76b-9a61b3c799e1)
![api_quota_2](https://github.com/jacksalvador/demo_01/assets/26760684/c2155da0-b294-4c93-9e43-6c9807e42fbb)

### 데이터 수집 범위

서울 근교에 있는 여행지 혹은 자주 찾는 곳을 입력하면
목적지를 입력하면 앞뒤 1주 30분 단위로 소요 시간 수집
(데모 시에는 사용한도 고려하여 1시간 단위로 수집)

- 단 아래 시간은 제외한다
  22:00 - 06:00 (8시간)
  따라서 실제 구하는 시간 7:00 - 21:00 (16시간)

18H _ 2 _ 7Day _ 2Week = 504
18H _ 7Day \* 2Week = 252 (데모)

목적지에 대한 각 시간대별 예상 시간
ex) "totalTime": 431 / 경로 총 소요 시간(단위: 초) 들을 전수 비교 및 소팅해서
가장 적게 걸리는 시간대 Top 10을 화면에 보여준다

# 시나리오 설명

1. FE 화면에서 특정 목적지를 입력하면
   지오코딩 API([Full Text Geocoding](https://tmapapi.sktelecom.com/main.html#webservice/sample/WebSampleFullAddrGeo))를 통해 좌표로 변환
   ex) "coordinates": [ 126.97874324930804, 37.56554646827642 ]

<img width="897" alt="text_geocoding_sample" src="https://github.com/jacksalvador/demo_01/assets/26760684/10d775a5-7728-4181-881c-5d33cfc2dfe1">

1. FE 화면에서 **실행 버튼**을 클릭하면 람다를 트리거
   람다는 위에서 구한 좌표에 대해 지정된 범위의 시간 (7:00 - 21:00)
   각각에 대해서 실행된다
   BE 배치 잡을 트리거(람다 자체가 배치 잡 실행할 경우 or EKS Batch Job)
2. 백엔드 서버에서는 동시에 여러 개의 워크로드가 실행되고
   각각의 워크로드에서는 좌표(변수)와 시간(상수)을 파라미터로 티맵 서버에 전달
   타임머신경로안내 API를 호출하여 데이터를 수집한다
3. totalTime(총 소요 시간)을 분 단위로 리턴
   리턴 받은 값을 DynamoDB(Key-Value Database)에 저장
   Key - 요일 및 시간
   Value - 소요 시간

### Querystring 파라미터 설명

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f07d933c-be48-4492-b1da-c2e8dfc831f2/3412c7fd-68ac-46f9-be31-d5a64373ea96/Untitled.png)

### 입력 코드 예시

```json
const requestData = {
  routesInfo: {
    departure: {
      name: 'test1',
      lon: '126.97878313064615',
      lat: '37.56554502354465'
    },
    destination: {
      name: 'test2',
      lon: '126.99212121963542',
      lat: '37.56436121826486'
    },
    predictionType: 'arrival',
    predictionTime: '2022-09-10T09:00:22+0900'
  }
};
```

### Request Payload 설명

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f07d933c-be48-4492-b1da-c2e8dfc831f2/67b050cd-b5ca-4127-862d-6bea3efef395/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f07d933c-be48-4492-b1da-c2e8dfc831f2/1f7d5fa6-7ae4-4773-b05e-68b83984bac5/Untitled.png)

## API 반환 예시

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f07d933c-be48-4492-b1da-c2e8dfc831f2/63ef0d48-4fca-4dbd-845e-c8dcefbeaf9d/Untitled.png)

[주제](https://www.notion.so/37c78d72b94746799e12f3b8e0fca6eb?pvs=21)
