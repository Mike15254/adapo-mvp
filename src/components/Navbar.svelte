<script lang="ts">
    import logo from "../assets/adapo-logo.png";
</script>

<header class="sticky inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
    <div class="bg-gray-300 text-center"> 
        <p class="p-2 text-sm">
           Update: We are now in Beta. Please contact us at <a href="mailto:hello@adapo.io " class="underline  underline-offset-2">hello@adapo.io</a> for more information.
        </p>
        
    </div>
    <nav class="mx-auto flex max-w-6xl gap-8 px-6 transition-all duration-200 ease-in-out  py-4">
        <div class="relative flex items-center">
            <a href="/">
                <img  src={logo.src} loading="lazy" style="color:transparent" width="32" height="32" alt="Adapo Logo" class="h-8 w-auto" />
            </a>
        </div>
        <ul class="hidden items-center justify-center gap-6 md:flex">
            <li class="pt-1.5 font-dm text-base font-medium text-slate-700">
                <a href="/">Invest</a>
            </li>
            <li class="pt-1.5 font-dm text-base font-medium text-slate-700">
                <a href="/">Rasie </a>
            </li>
        </ul>
        <div class="flex-grow"></div>
        <div class="hidden items-center justify-center gap-6 md:flex">
            <a href="/" class="font-dm text-base font-medium text-slate-700">Login</a>
            <a href="/" class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                Sign up
            </a>
            
            
        </div>
        <div class="relative flex items-center justify-center md:hidden">
            <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-auto text-slate-900"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path></svg>
            </button>
        </div>
    </nav>
</header>