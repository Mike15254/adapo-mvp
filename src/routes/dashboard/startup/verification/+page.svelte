<!-- src/routes/dashboard/startup/verification/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import { pb } from '$lib/pocketbase';
  import { Upload, AlertCircle, CheckCircle, FileText } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let loading = false;
  let currentStep = 0;
  let error = '';
  let files: Record<string, File | null> = {};
  let formData = {
      company_name: '',
      registration_number: '',
      verification_status: 'pending'
  };

  // Initialize files object
  $: {
      data.requirements?.forEach(req => {
          if (!(req.title in files)) {
              files[req.title] = null;
          }
      });
  }

  function validateStep(step: number): boolean {
      if (step === 0) {
          if (!formData.company_name || !formData.registration_number) {
              error = 'Please fill in all required fields';
              return false;
          }
          return true;
      }

      if (step === 1) {
          const missingFiles = data.requirements
              .filter(req => req.required && !files[req.title])
              .map(req => req.title);

          if (missingFiles.length > 0) {
              error = `Missing required documents: ${missingFiles.join(', ')}`;
              return false;
          }
          return true;
      }

      return true;
  }

  function handleFileChange(event: Event, title: string) {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      const file = input.files[0];
      const requirement = data.requirements.find(r => r.title === title);

      if (!requirement) return;

      if (file.size > requirement.maxSize) {
          error = `File too large. Maximum size is ${requirement.maxSize / 1024 / 1024}MB`;
          input.value = '';
          return;
      }

      if (!requirement.allowedTypes.includes(file.type)) {
          error = `Invalid file type. Allowed types: ${requirement.allowedTypes.join(', ')}`;
          input.value = '';
          return;
      }

      files[title] = file;
      error = '';
  }

  async function handleSubmit() {
      try {
          if (!validateStep(currentStep)) return;
          
          loading = true;
          error = '';

          // Create FormData
          const submitData = new FormData();
          submitData.append('user', data.user.id);
          submitData.append('company_name', formData.company_name);
          submitData.append('registration_number', formData.registration_number);
          submitData.append('verification_status', 'pending');

          // Add files
          Object.entries(files).forEach(([title, file]) => {
              if (file) {
                  submitData.append('documents', file);
              }
          });

          // Submit to PocketBase
          await pb.collection('startups').create(submitData);

          // Redirect to dashboard with success message
          goto('/dashboard/startup?message=verification-submitted');
      } catch (err) {
          console.error('Verification submission error:', err);
          error = err instanceof Error ? err.message : 'Failed to submit verification';
      } finally {
          loading = false;
      }
  }
</script>

<div class="max-w-4xl mx-auto py-8 px-4" in:fade>
  <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Startup Verification</h1>
      <p class="mt-2 text-sm text-gray-600">
          Complete the verification process to start fundraising
      </p>
  </div>

  <!-- Progress Steps -->
  <div class="mb-8">
      <div class="flex items-center justify-between">
          <div class="flex items-center">
              <div class={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>
                  1
              </div>
              <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Company Details</p>
              </div>
          </div>
          <div class="hidden sm:block w-24 border-t border-gray-200"></div>
          <div class="flex items-center">
              <div class={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>
                  2
              </div>
              <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Documents</p>
              </div>
          </div>
      </div>
  </div>

  {#if error}
      <div class="mb-6 rounded-md bg-red-50 p-4" transition:fade>
          <div class="flex">
              <AlertCircle class="h-5 w-5 text-red-400" />
              <p class="ml-3 text-sm text-red-700">{error}</p>
          </div>
      </div>
  {/if}

  <div class="bg-white shadow rounded-lg">
      {#if currentStep === 0}
          <div class="p-6 space-y-6" in:fade>
              <div>
                  <label for="company_name" class="block text-sm font-medium text-gray-700">
                      Company Name <span class="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      id="company_name"
                      bind:value={formData.company_name}
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                  />
              </div>

              <div>
                  <label for="registration_number" class="block text-sm font-medium text-gray-700">
                      Business Registration Number <span class="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      id="registration_number"
                      bind:value={formData.registration_number}
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                  />
              </div>
          </div>
      {:else}
          <div class="p-6 space-y-6" in:fade>
              {#each data.requirements as requirement}
                  <div class="border rounded-lg p-4">
                      <div class="flex justify-between">
                          <div>
                              <h3 class="text-sm font-medium text-gray-900">
                                  {requirement.title}
                                  {#if requirement.required}
                                      <span class="text-red-500">*</span>
                                  {/if}
                              </h3>
                              <p class="mt-1 text-xs text-gray-500">
                                  {requirement.description}
                              </p>
                          </div>
                          {#if files[requirement.title]}
                              <CheckCircle class="h-5 w-5 text-green-500" />
                          {/if}
                      </div>

                      <div class="mt-4">
                          <label class="block">
                              <span class="sr-only">Choose file</span>
                              <input
                                  type="file"
                                  accept={requirement.allowedTypes.join(',')}
                                  class="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-indigo-50 file:text-indigo-700
                                      hover:file:bg-indigo-100"
                                  on:change={(e) => handleFileChange(e, requirement.title)}
                              />
                          </label>
                      </div>
                  </div>
              {/each}
          </div>
      {/if}

      <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          {#if currentStep > 0}
              <button
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  on:click={() => currentStep--}
              >
                  Previous
              </button>
          {:else}
              <div></div>
          {/if}

          <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              on:click={() => {
                  if (currentStep === 1) {
                      handleSubmit();
                  } else if (validateStep(currentStep)) {
                      currentStep++;
                  }
              }}
              disabled={loading}
          >
              {#if loading}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              {/if}
              {currentStep === 1 ? 'Submit' : 'Next'}
          </button>
      </div>
  </div>
</div>