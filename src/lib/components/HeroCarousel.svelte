<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';

    import Banner1 from '$lib/assets/image1.avif';
    import Banner2 from '$lib/assets/climate-change.avif';
    import Banner3 from '$lib/assets/blockChain.avif';
    import Banner4 from '$lib/assets/finTech.avif';

    interface CarouselImage {
        alt: string;
        src: string;
        title: string;
        description: string;
        link: string;
    }

    const images: CarouselImage[] = [
        
        
        {
            alt: 'Blockchain Technology',
            src: Banner3,
            title: 'Decentralized Finance',
            description: 'Revolutionary blockchain projects for financial inclusion',
            link: '/projects/defi'
        },
		{
            alt: 'Business Innovation',
            src: Banner1,
            title: 'Empowering SMEs',
            description: 'Innovative solutions for small and medium enterprises',
            link: '/projects/sme-innovation'
        },
        {
            alt: 'FinTech Solutions',
            src: Banner4,
            title: 'Mobile Banking',
            description: 'Next-generation financial technology for all',
            link: '/projects/mobile-banking'
        },
		{
            alt: 'Climate Change Initiative',
            src: Banner2,
            title: 'Green Energy Solutions',
            description: 'Sustainable projects tackling climate change',
            link: '/projects/green-energy'
        }
    ];

    let currentIndex = 0;
    let timer: number;

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    function startAutoplay() {
        timer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(timer);
    }

    onMount(() => {
        startAutoplay();
    });

    onDestroy(() => {
        stopAutoplay();
    });
</script>

<div class="relative w-full h-[200px] lg:h-[400px] overflow-hidden rounded-2xl">
    {#each images as image, index}
        {#if index === currentIndex}
            <div
                class="absolute w-full h-full"
                in:fade={{ duration: 300 }}
                out:fade={{ duration: 300 }}
            >
                <img src={image.src} loading="lazy" alt={image.alt} class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4  opacity-100 transition-opacity duration-300">
                    <h2 class="text-lg lg:text-2xl font-bold mb-2">{image.title}</h2>
                    <p class="text-center mb-4 text-sm lg:text-base">{image.description}</p>
                    <a href={image.link} class="bg-primary text-white px-4 py-2 text-sm rounded-md hover:bg-opacity-80 transition-colors">
                        Learn More
                    </a>
                </div>
            </div>
        {/if}
    {/each}
    
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {#each images as _, index}
            <button
                class="w-12 h-1 rounded-lg bg-gray-200  hover:opacity-100 transition-opacity duration-200 {index === currentIndex ? 'opacity-20' : ''}"
                on:click={() => currentIndex = index}
            ></button>
        {/each}
    </div>
</div>