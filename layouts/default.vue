<template>
  <div>
    <header>
      <slot name="header">
        <AppHeader />
      </slot>
    </header>
    <main>
      <div class="antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen place-content-center flex flex-col items-center justify-center text-sm sm:text-base">
        <div class="flex flex-col gap-y-4 items-center justify-center">
          <slot />
        </div>
      </div>
    </main>
    <footer>
      <slot name="footer">
          <AppFooter />
      </slot>
    </footer>
  </div>
</template>
