<template>
  <h1 class="text-2xl text-center mb-16 mt-[25%]">
    Bienvenue sur Recettes à gogo !
  </h1>

  <div class="flex shadow-sm hover:shadow-lg rounded-lg transition-shadow">
    <Tabs default-value="account" class="w-[500px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="account" class="hover:cursor-pointer">
          Connexion
        </TabsTrigger>
        <TabsTrigger value="password" class="hover:cursor-pointer">
          Inscription
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <LoginSignIn />
      </TabsContent>

      <TabsContent value="password">
        <LoginSignUp />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>
