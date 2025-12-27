<template>
  <div class="bg-secondary-light fixed z-10 mb-6 flex w-full items-center py-2">
    <NavigationMenu class="mx-auto flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" :class="navigationMenuTriggerStyle()">
            Accueil
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Les recettes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
            >
              <li v-for="component in components" :key="component.title">
                <NavigationMenuLink as-child>
                  <a
                    :href="component.href"
                    class="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                  >
                    <div class="text-sm leading-none font-medium">
                      {{ component.title }}
                    </div>
                    <p
                      class="text-muted-foreground line-clamp-2 text-sm leading-snug"
                    >
                      {{ component.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/recipes/my-recipes"
            :class="navigationMenuTriggerStyle()"
          >
            Mes recettes
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href="/profile"
            :class="navigationMenuTriggerStyle()"
          >
            Mon profil
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <Button
      v-if="status == 'authenticated'"
      variant="outline"
      class="bg-secondary-200 text-primary-600 hover:text-primary-600 hover:bg-secondary-light mr-2 hover:cursor-pointer"
      @click="signOut()"
    >
      Déconnexion
    </Button>
  </div>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Les recettes',
    href: '/recipes',
    description: 'Découvrez plein de nouvelles recettes ici !'
  },
  {
    title: 'Créer une recette',
    href: '/recipes/create',
    description: 'Créez vos propres recettes et partagez-les avec la communauté'
  }
]

const { signOut, status } = useAuth()
</script>
