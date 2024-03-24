<template>
  <div>
    <header>
      <slot name="header">
        <AppHeader />
      </slot>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer">
          <AppFooter />
      </slot>
    </footer>
  </div>
</template>
