<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ChevronDown } from 'lucide-svelte';

  export let value: string | number;
  export let options: Array<{ value: string | number; label: string }>;
  export let placeholder = 'Select...';
  export let icon: any = null;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let isOpen = false;
  let dropdownRef: HTMLDivElement;

  $: selectedOption = options.find(opt => opt.value === value);

  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }

  function selectOption(option: typeof options[0]) {
    value = option.value;
    isOpen = false;
    dispatch('change', { value: option.value });
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div bind:this={dropdownRef} class="relative">
  <button
    type="button"
    on:click={toggleDropdown}
    class="w-full px-3 py-2.5 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:bg-gray-750 hover:border-gray-600 transition-all cursor-pointer flex items-center justify-between gap-2 {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    disabled={disabled}
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      {#if icon}
        <svelte:component this={icon} size={16} class="text-gray-500 flex-shrink-0" />
      {/if}
      <span class="truncate">{selectedOption?.label || placeholder}</span>
    </div>
    <ChevronDown size={16} class="text-gray-400 flex-shrink-0 transition-transform {isOpen ? 'rotate-180' : ''}" />
  </button>

  {#if isOpen}
    <div class="absolute z-50 w-full mt-1 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
      {#each options as option}
        <button
          type="button"
          on:click={() => selectOption(option)}
          class="w-full px-3 py-2.5 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2 {option.value === value ? 'bg-gray-700/50' : ''}"
        >
          <span class="truncate">{option.label}</span>
          {#if option.value === value}
            <div class="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .max-h-60 {
    max-height: 15rem;
  }
  
  .max-h-60::-webkit-scrollbar {
    width: 8px;
  }
  
  .max-h-60::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 4px;
  }
  
  .max-h-60::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
  }
  
  .max-h-60::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
</style>
