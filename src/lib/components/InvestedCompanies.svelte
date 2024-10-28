<script lang="ts">
    import { onMount } from 'svelte';

    // Import your logo images
    import logo1 from '../assets/safaricom.png';
    import logo2 from '../assets/techstars.png';
    import logo3 from '../assets/tecno.png';
    import logo4 from '../assets/ncba.png';
    import logo5 from '../assets/antler.jpg';
    import logo6 from '../assets/kq.png';

    const companyLogos = [
        { src: logo1, alt: 'Safaricom' },
        { src: logo2, alt: 'Techstars' },
        { src: logo3, alt: 'Tecno' },
        { src: logo4, alt: 'NCBA' },
        { src: logo5, alt: 'Antler' },
        { src: logo6, alt: 'Kenya Airways' },
    ];

    let scrollContainer: HTMLDivElement;
    let isHovered = false;

    onMount(() => {
        const scrollWidth = scrollContainer.scrollWidth;
        const animationDuration = scrollWidth / 50; // Adjust speed as needed

        scrollContainer.style.setProperty('--scroll-width', `${scrollWidth}px`);
        scrollContainer.style.setProperty('--animation-duration', `${animationDuration}s`);
    });

    function handleMouseEnter() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
    }
</script>

<section class="py-16">
    <div class="container mx-auto px-4 max-w-7xl">
        <h2 class="text-3xl font-medium mb-6">Companies That Have Invested with Adapo</h2>
        <p class="mb-6 text-sm text-gray-600 lg:text-base">
            Some of the top names in venture capital have invested in the same companies that raise on Adapo
        </p>
        <div 
        role="region"
            class="flex overflow-hidden mt-8 py-12" 
            bind:this={scrollContainer}
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
        >
            <div class="flex animate-loop-scroll" class:paused={isHovered}>
                {#each [...companyLogos, ...companyLogos] as logo}
                    <div class="w-40 h-20 flex items-center justify-center mx-4">
                        <img src={logo.src} alt={logo.alt} class="max-w-full max-h-full object-contain" />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    @keyframes loop-scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(calc(-1 * var(--scroll-width) / 2));
        }
    }

    .animate-loop-scroll {
        animation: loop-scroll var(--animation-duration) linear infinite;
    }

    .animate-loop-scroll.paused {
        animation-play-state: paused;
    }
</style>