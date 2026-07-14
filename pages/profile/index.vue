<template>
  <div
    class="relative h-full min-h-screen w-screen px-4 pt-[10vh] pb-20 md:px-[10vw] md:pt-[100px]"
  >
    <div
      class="h-[50%] w-full flex-col items-center justify-center rounded-2xl bg-[url('/img/background.jpg')] bg-cover bg-center px-1 py-4 md:w-[80vw] md:px-15 md:py-10"
    >
      <div class="mb-6 flex items-center justify-center">
        <h1 class="text-primary-700 text-center text-2xl">Mon profil</h1>
        <NuxtLink to="/profile/edit">
          <PenIcon
            class="ml-2 size-5 transition-transform duration-320 hover:scale-110 hover:rotate-3 hover:cursor-pointer"
          />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr] md:gap-6">
        <SignedImage
          :file-name="user.imageFileName || '/img/list2.png'"
          :initial-url="user.imageUrl || '/img/list2.png'"
          alt="Image de profil"
          class="bg-secondary-100 pointer-events-none mx-auto aspect-square h-[180px] max-h-[250px] w-[180px] rounded-full object-cover"
        />

        <div class="ml-6 md:ml-0">
          <h5 class="text-primary-700 font-bold">Nom</h5>
          <p class="text-primary-600">{{ user.lastName }}</p>

          <h5 class="text-primary-700 mt-3 font-bold">Prénom</h5>
          <p class="text-primary-600">{{ user.firstName }}</p>

          <h5 class="text-primary-700 mt-3 font-bold">Email</h5>
          <p class="text-primary-600">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <section
      class="mt-6 w-full rounded-2xl bg-white px-4 py-6 md:w-[80vw] md:px-8"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-primary-700 text-xl">Ma liste de courses</h2>

        <Button
          v-if="shoppingList.length > 0"
          size="sm"
          class="text-destructive border-destructive/10 hover:bg-destructive/10 cursor-pointer border bg-white"
          :disabled="isResetting"
          @click="resetShoppingList"
        >
          <Trash2Icon class="size-4" />
          Réinitialiser
        </Button>
      </div>

      <p
        v-if="!isFetchingList && shoppingList.length === 0"
        class="text-muted-foreground text-sm italic"
      >
        Votre liste de courses est vide.
      </p>

      <Loader v-if="isFetchingList" />

      <ul v-if="shoppingList.length > 0" class="space-y-2">
        <li
          v-for="item in shoppingList"
          :key="item.id"
          class="border-primary-100 flex items-center justify-between rounded-lg border p-2"
        >
          <div class="flex items-center gap-2">
            <CircleSmallIcon size="12px" fill="#795f6b" />
            <span>
              {{ item.title }}
              <span class="text-muted-foreground">
                ({{ item.quantity }} {{ units[item.unit] }})
              </span>
              <span
                v-if="item.recipeTitle"
                class="text-primary-600 ml-1 text-xs italic"
              >
                — {{ item.recipeTitle }}</span
              >
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            class="text-destructive hover:bg-destructive/10 hover:text-destructive size-7 cursor-pointer"
            :disabled="removingItems.has(item.id)"
            @click="removeFromShoppingList(item.id)"
          >
            <XIcon class="size-4" />
          </Button>
        </li>
      </ul>
    </section>

    <NuxtImg
      src="/img/auth1.png"
      alt="Image d'illustration"
      format="webp"
      sizes="(max-width: 500px) 60px, (max-width: 1000px) 12vw, 120px"
      class="absolute right-[4%] bottom-4 w-[12%] max-w-[120px] min-w-[60px] rotate-80"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PenIcon, CircleSmallIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import units from '@/constants/Units'

const userId = ref(null)
const { data: userData } = await useAuth()
userId.value = userData.value?.user?.id

const { data: user } = await useFetch(
  `/api/users/${userId.value}?userId=${userId.value}`
)

const { data: shoppingList, isFetching: isFetchingList } = await useFetch(
  `/api/shopping-list?userId=${userId.value}`,
  {
    default: () => []
  }
)

const isResetting = ref(false)
const removingItems = ref(new Set())

const removeFromShoppingList = async (id) => {
  removingItems.value = new Set([...removingItems.value, id])

  try {
    await $fetch(`/api/shopping-list/${id}`, {
      method: 'DELETE'
    })

    shoppingList.value = shoppingList.value.filter((item) => item.id !== id)

    toast('Retiré', {
      description: "L'ingrédient a été retiré de la liste de courses."
    })
  } catch {
    toast('Erreur', {
      description: "Impossible de retirer l'ingrédient."
    })
  } finally {
    const next = new Set(removingItems.value)
    next.delete(id)
    removingItems.value = next
  }
}

const resetShoppingList = async () => {
  isResetting.value = true

  try {
    await $fetch('/api/shopping-list', {
      method: 'DELETE'
    })

    shoppingList.value = []

    toast('Liste réinitialisée', {
      description: 'La liste de courses a été vidée.'
    })
  } catch {
    toast('Erreur', {
      description: 'Impossible de réinitialiser la liste de courses.'
    })
  } finally {
    isResetting.value = false
  }
}
</script>
