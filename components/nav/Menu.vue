<template>
  <div class="fixed z-10 mb-6 flex w-full items-center py-2">
    <div class="w-20" />

    <NavigationMenu class="mx-auto flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" :class="navigationMenuTriggerStyle()">
            Accueil
          </NavigationMenuLink>
        </NavigationMenuItem>

        <div class="h-4 w-px rounded-md border border-white" />

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/recipes"
            :class="navigationMenuTriggerStyle()"
          >
            Découvrir
          </NavigationMenuLink>
        </NavigationMenuItem>

        <div class="h-4 w-px rounded-md border border-white" />

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/recipes/my-recipes"
            :class="navigationMenuTriggerStyle()"
          >
            Mes recettes
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div v-if="user.isAdmin">
      <Settings
        class="text-primary-600 mr-3 size-7 stroke-[1.35] hover:cursor-pointer hover:opacity-70"
        @click="$router.push('/admin')"
      />
    </div>

    <div v-if="status === 'authenticated'" class="mr-7 flex justify-center">
      <CircleUserRound
        class="text-primary-600 mr-3 size-7 stroke-[1.35] hover:cursor-pointer hover:opacity-70"
        @click="$router.push('/profile')"
      />

      <LogOut
        class="text-primary-600 mr-3 size-7 stroke-[1.35] hover:cursor-pointer hover:opacity-70"
        @click="signOut()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

import { CircleUserRound, LogOut, Settings } from 'lucide-vue-next'

const { signOut, status, data: userData } = useAuth()

const userId = ref(null)
userId.value = userData.value?.user?.id

const { data: user } = await useFetch(
  `/api/users/${userId.value}?userId=${userId.value}`
)
</script>
