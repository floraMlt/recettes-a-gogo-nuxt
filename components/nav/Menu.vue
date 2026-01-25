<template>
  <div
    class="bg-secondary fixed z-20 mb-6 flex w-full items-center py-1 shadow-sm md:shadow-none"
  >
    <div class="hidden md:block md:w-20" />

    <NavigationMenu class="mr-1 ml-auto flex md:mx-auto">
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

    <CircleUserRoundIcon
      class="text-primary-600 mr-3 flex size-6 stroke-[1.35] transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer md:hidden"
      @click="$router.push('/profile')"
    />

    <div class="hidden items-center md:flex">
      <div v-if="user.isAdmin">
        <SettingsIcon
          class="text-primary-600 mr-3 size-7 stroke-[1.35] transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
          @click="$router.push('/admin')"
        />
      </div>

      <div v-if="status === 'authenticated'" class="mr-7 flex justify-center">
        <CircleUserRoundIcon
          class="text-primary-600 mr-3 size-7 stroke-[1.35] transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
          @click="$router.push('/profile')"
        />

        <LogOutIcon
          class="text-primary-600 mr-3 size-7 stroke-[1.35] transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
          @click="signOut()"
        />
      </div>
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

import { CircleUserRoundIcon, LogOutIcon, SettingsIcon } from 'lucide-vue-next'

const { signOut, status, data: userData } = useAuth()

const userId = ref(null)
userId.value = userData.value?.user?.id

const { data: user } = await useFetch(
  `/api/users/${userId.value}?userId=${userId.value}`
)
</script>
