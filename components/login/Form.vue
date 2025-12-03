<template>
  <div>
    <Tabs default-value="login" class="w-[450px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="login" class="hover:cursor-pointer">
          Connexion
        </TabsTrigger>
        <TabsTrigger value="signup" class="hover:cursor-pointer">
          Inscription
        </TabsTrigger>
      </TabsList>

      <div class="flex rounded-lg">
        <TabsContent value="login" class="bg-white">
          <LoginSignIn />
        </TabsContent>

        <TabsContent value="signup">
          <LoginSignUp />
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>
