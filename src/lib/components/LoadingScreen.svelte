<script lang="ts">
    export let message = 'Loading...';
  </script>
  
  <div class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="text-center">
      <!-- Investment/Growth themed SVG animation -->
      <svg
        class="w-24 h-24 mx-auto mb-6 text-indigo-600"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
          <!-- Growing chart line animation -->
          <path class="animate-draw">
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="
                M10,90 Q25,90 40,90;
                M10,90 Q25,70 40,50;
                M10,90 Q25,50 40,30;
                M10,90 Q25,30 40,20;
                M10,90 Q25,90 40,90
              "
            />
          </path>
          <!-- Second line -->
          <path class="animate-draw" style="animation-delay: 0.2s;">
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="
                M40,90 Q55,90 70,90;
                M40,50 Q55,40 70,35;
                M40,30 Q55,25 70,20;
                M40,20 Q55,15 70,10;
                M40,90 Q55,90 70,90
              "
            />
          </path>
          <!-- Arrow -->
          <path class="animate-draw" style="animation-delay: 0.4s;">
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="
                M70,90 L90,90;
                M70,35 L90,30;
                M70,20 L90,15;
                M70,10 L90,5;
                M70,90 L90,90
              "
            />
          </path>
        </g>
      </svg>
      
      <h2 class="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h2>
      <div class="flex justify-center space-x-2">
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style="animation-delay: 0.2s;"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style="animation-delay: 0.4s;"></div>
      </div>
    </div>
  </div>
  
  <style>
    .animate-draw {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw 1.5s ease-in-out infinite;
    }
  
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
  </style>