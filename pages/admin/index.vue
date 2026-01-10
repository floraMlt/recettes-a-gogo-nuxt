<template>
  <div class="relative h-full min-h-screen px-[10vw] pt-[100px] pb-20">
    <div
      class="h-[50%] w-[80vw] flex-col items-center justify-center rounded-2xl bg-white px-15 py-10"
    >
      <div class="mb-6 flex flex-col items-center justify-center">
        <h1 class="text-primary-700 mb-3 text-center text-2xl">
          Administration
        </h1>
        <p class="mb-4">Comptes administrateurs</p>

        <table class="border">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Nom</th>
              <th class="px-4 py-2 text-left">Prénom</th>
              <th class="px-4 py-2 text-left">Administrateur</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="border px-4 py-2">{{ user.lastName }}</td>
              <td class="border px-4 py-2">{{ user.firstName }}</td>
              <td class="border px-4 py-2">
                <input
                  type="checkbox"
                  :checked="user.isAdmin"
                  class="border-secondary-200 border bg-white hover:cursor-pointer"
                  @change="toggleAdmin(user, $event.target.checked)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const { data: users } = await useFetch('/api/users')

const toggleAdmin = async (user, newValue) => {
  try {
    await useFetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      body: { isAdmin: newValue }
    })

    user.isAdmin = newValue

    toast("Les droits de l'utilisateur ont été mis à jour")
  } catch (error) {
    console.error('Erreur lors de la mise à jour', error)
    user.isAdmin = !newValue
  }
}
</script>
