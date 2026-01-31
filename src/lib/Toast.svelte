<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-svelte';

  export let message: string;
  export let type: 'success' | 'error' | 'info' | 'warning' = 'info';
  export let duration: number = 5000;
  export let onClose: () => void;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
    warning: 'bg-yellow-500/90',
  };

  onMount(() => {
    if (duration > 0) {
      const timeout = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timeout);
    }
  });
</script>

<div
  class="fixed bottom-6 right-6 z-[9999] max-w-md"
  in:fly={{ y: 50, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <div class="{colors[type]} backdrop-blur-sm text-white px-5 py-4 rounded-xl shadow-2xl border border-white/10 flex items-start gap-3">
    <svelte:component this={icons[type]} size={20} class="flex-shrink-0 mt-0.5" />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium leading-relaxed break-words whitespace-pre-wrap">{message}</p>
    </div>
    <button
      on:click={onClose}
      class="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      aria-label="Close notification"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>
