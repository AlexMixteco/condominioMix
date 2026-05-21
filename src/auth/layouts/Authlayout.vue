<template>
  <div class="flex flex-col h-screen">
       <!-- Header -->
    <header class="flex items-center px-4 border-b border-gray-300 sm:px-6 lg:px-8 bg-black">
    <div>

    </div>
    </header>
      <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div class="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div class="w-full">
            <RouterView />
          </div>
        </div>
      </div>
  </div>
</template>
