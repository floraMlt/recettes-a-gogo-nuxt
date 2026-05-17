<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <Toaster />
    <PwaInstallBanner />
  </ClientOnly>
</template>
