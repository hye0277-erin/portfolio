HYE02 Rotunda Portfolio v3
==========================

구성
----
index.html
- 3D 원형 로톤드 인트로
- About
- Selected Works
- Experience Archive 미리보기 섹션
- Process
- Contact

archive.html
- 이전 회사 작업물 / 추가 포트폴리오 작업물 리스트 페이지
- 첨부 이미지처럼 썸네일 카드 그리드 형태
- 각 카드의 href="#" 부분을 실제 링크로 교체하면 됩니다.

폴더
----
css/style.css
js/main.js
images/

이미지 넣는 방법
---------------
1. images 폴더에 jpg/png/webp 파일을 넣습니다.
2. HTML에서 empty-image 안에 img 태그를 넣습니다.
3. 이미지가 들어간 div에서 empty-image 클래스를 지우면 안내선이 사라집니다.

예시
----
<div class="company-thumb">
  <img src="./images/company-detail-01.jpg" alt="식품 상세페이지 작업 화면" />
</div>

수정해야 할 부분
---------------
- index.html / archive.html 안의 TODO 주석 검색
- href="#" 링크를 실제 작업물 주소로 교체
- 회사명/작업명/설명 문구 수정
- 썸네일 이미지 교체

주의
----
- 한글 이미지 파일명보다 영문 소문자 파일명을 추천합니다.
- jpg 사용 가능, 투명 배경은 png, 용량 최적화는 webp 추천합니다.
