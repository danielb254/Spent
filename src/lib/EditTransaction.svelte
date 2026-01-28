<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { invoke } from '@tauri-apps/api/core';
  import { X, DollarSign, Edit } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let transaction: {
    id: number;
    amount: number;
    description: string;
    category: string;
    date: string;
  };

  let amount = '';
  let description = '';
  let category = '';
  let transactionType: 'expense' | 'income' = 'expense';
  let categories: string[] = [];

  async function loadCategories() {
    try {
      categories = await invoke<string[]>('get_categories');
    } catch (error) {
      console.error('Failed to load categories:', error);
      categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Income', 'Other'];
    }
  }

  function initializeForm() {
    const absAmount = Math.abs(transaction.amount) / 100;
    amount = absAmount.toString();
    description = transaction.description;
    category = transaction.category;
    transactionType = transaction.amount >= 0 ? 'income' : 'expense';
  }

  async function handleSubmit() {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount) {
      return;
    }

    const amountInCents = Math.round(parsedAmount * 100);
    const finalAmount = transactionType === 'expense' ? -Math.abs(amountInCents) : Math.abs(amountInCents);

    dispatch('save', {
      id: transaction.id,
      amount: finalAmount,
      description: description.trim() || transaction.category,
      category: category || 'Other',
    });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dispatch('close');
    }
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSubmit();
    }
  }

  onMount(() => {
    loadCategories();
    initializeForm();
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
  <div class="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl overflow-hidden" in:scale={{ duration: 300, start: 0.9, easing: backOut }}>
    <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <Edit class="text-white" size={20} />
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">Edit Transaction</h3>
          <p class="text-purple-100 text-xs">Update transaction details</p>
        </div>
      </div>
      <button
        on:click={() => dispatch('close')}
        class="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
      >
        <X size={20} />
      </button>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-5">
      <div>
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Type
        </label>
        <div class="flex gap-2">
          <button
            type="button"
            on:click={() => transactionType = 'expense'}
            class="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 {transactionType === 'expense' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}"
          >
            Expense
          </button>
          <button
            type="button"
            on:click={() => transactionType = 'income'}
            class="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 {transactionType === 'income' ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}"
          >
            Income
          </button>
        </div>
      </div>

      <div>
        <label for="amount" class="block text-sm font-semibold text-gray-300 mb-2">
          Amount *
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span class="text-gray-500 text-lg">$</span>
          </div>
          <input
            id="amount"
            type="number"
            step="0.01"
            bind:value={amount}
            placeholder="0.00"
            class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-lg font-semibold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label for="description" class="block text-sm font-semibold text-gray-300 mb-2">
          Description
        </label>
        <input
          id="description"
          type="text"
          bind:value={description}
          placeholder="Coffee, groceries, salary..."
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label for="category" class="block text-sm font-semibold text-gray-300 mb-2">
          Category
        </label>
        <select
          id="category"
          bind:value={category}
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer appearance-none"
          style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
        >
          {#each categories as cat}
            <option value={cat} class="bg-gray-800 text-white">{cat}</option>
          {/each}
        </select>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>
