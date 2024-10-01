<script lang="=ts">
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import Image from '../assets/business.png';

</script>

<Splide aria-label="My Favorite Images">
    <SplideSlide>
      <img src={Image.src} alt="new Image"/>
    </SplideSlide>
    <SplideSlide>
      <img src="{Image.src}" alt="Image 2"/>
    </SplideSlide>
  </Splide>