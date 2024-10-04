<script lang="ts">
  export let currentStep: 'type' | 'info' | 'verify' | 'success';
  
  const steps = [
      { id: 'type', label: 'Account Type' },
      { id: 'info', label: 'Personal Info' },
      { id: 'verify', label: 'Verification' }
  ];

  function getStepClass(stepId: string) {
      if (stepId === currentStep) {
          return 'font-bold text-blue-600';
      } else if (steps.findIndex(s => s.id === stepId) < steps.findIndex(s => s.id === currentStep) || currentStep === 'success') {
          return 'text-green-600';
      } else {
          return 'text-gray-400';
      }
  }

  function getStepIconClass(stepId: string) {
      if (stepId === currentStep) {
          return 'border-blue-600 text-blue-600';
      } else if (steps.findIndex(s => s.id === stepId) < steps.findIndex(s => s.id === currentStep) || currentStep === 'success') {
          return 'border-green-600 bg-green-600 text-white';
      } else {
          return 'border-gray-300 text-gray-300';
      }
  }
</script>

<div class="flex justify-between items-center mb-8">
  {#each steps as step, index}
      <div class="flex flex-col items-center">
          <div class={`${getStepClass(step.id)} flex items-center`}>
              <span class={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${getStepIconClass(step.id)}`}>
                  {#if steps.findIndex(s => s.id === step.id) < steps.findIndex(s => s.id === currentStep) || currentStep === 'success'}
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                  {:else}
                      {index + 1}
                  {/if}
              </span>
          </div>
          <span class="mt-2 text-xs sm:text-sm">{step.label}</span>
      </div>
      {#if index < steps.length - 1}
          <div class="hidden sm:block w-16 h-1 bg-gray-300">
              <div class={`h-full ${
                  steps.findIndex(s => s.id === step.id) < steps.findIndex(s => s.id === currentStep) || currentStep === 'success'
                      ? 'bg-green-600'
                      : ''
              }`} style="width: {currentStep === 'success' ? '100%' : steps.findIndex(s => s.id === currentStep) > index ? '100%' : '0%'};" />
          </div>
      {/if}
  {/each}
</div>