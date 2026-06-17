# Portfolio About Page

포트폴리오 소개 페이지용 HTML 구조입니다.  
1920×1080 풀스크린 섹션 기준으로 제작했고, 반응형에서도 무너지지 않도록 CSS를 분리했습니다.

## 폴더 구조

```text
portfolio-about-page/
├─ index.html
├─ css/
│  ├─ reset.css
│  ├─ variables.css
│  ├─ layout.css
│  ├─ components.css
│  └─ animations.css
├─ js/
│  ├─ common.js
│  └─ gsap-animations.js
└─ assets/
   └─ images/
      ├─ avatar-portrait.svg
      ├─ avatar-side.svg
      └─ avatar-back.svg
```

## 수정 우선순위

1. `index.html`에서 텍스트 수정
2. `css/variables.css`에서 색상, 폰트, 간격 수정
3. `css/components.css`에서 카드, 버튼, 타임라인 스타일 수정
4. `js/gsap-animations.js`에서 섹션별 애니메이션 강도 수정

## 이미지 사용 방식

실물 사진을 직접 넣지 않는 방향으로 맞췄습니다.  
현재 SVG는 임시 일러스트 자리입니다.

교체하려면 아래 파일명만 유지해서 바꾸면 됩니다.

- `assets/images/avatar-portrait.svg` : 첫 화면용 흑백 일러스트/3D 아바타
- `assets/images/avatar-side.svg` : About 섹션용 측면 일러스트
- `assets/images/avatar-back.svg` : Contact 섹션용 뒷모습 실루엣

## GSAP

CDN으로 연결되어 있습니다.

- GSAP
- ScrollTrigger
- ScrollToPlugin

인터넷 연결 없이 로컬에서 완전히 사용하려면 GSAP 파일을 직접 다운로드한 뒤 `js/vendor/` 폴더를 만들어 연결하면 됩니다.
