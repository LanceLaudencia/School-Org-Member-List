<template>

  <ion-page>

    <ion-header>

      <ion-toolbar>

        <ion-title>
          Organization Members
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <ion-content>

      <div class="page-container">

        <!-- SEARCH -->

        <ion-searchbar
          v-model="searchText"
          placeholder="Search member..."
        ></ion-searchbar>


        <!-- ADD BUTTON -->

        <ion-button
          expand="block"
          @click="goToAddMember"
        >

          <ion-icon
            :icon="addOutline"
            slot="start"
          ></ion-icon>

          Add Member

        </ion-button>


        <!-- LOADING -->

        <div
          v-if="loading"
          class="loading"
        >

          <ion-spinner></ion-spinner>

          <p>Loading members...</p>

        </div>


        <!-- EMPTY -->

        <div
          v-else-if="filteredMembers.length === 0"
          class="empty"
        >

          <h2>No Members Found</h2>

          <p>
            Add an organization member to get started.
          </p>

        </div>


        <!-- MEMBER LIST -->

        <ion-list v-else>

          <ion-item-sliding
            v-for="member in filteredMembers"
            :key="member.id"
          >

            <ion-item>

              <ion-label>

                <h2>
                  {{ member.name }}
                </h2>

                <p>
                  <strong>Member ID:</strong>
                  {{ member.memberId }}
                </p>

                <p>
                  <strong>Course:</strong>
                  {{ member.course }}
                </p>

                <p>
                  <strong>Year:</strong>
                  {{ member.yearLevel }}
                </p>

                <p>
                  <strong>Position:</strong>
                  {{ member.position }}
                </p>

                <p>
                  <strong>Contact:</strong>
                  {{ member.contact }}
                </p>

              </ion-label>


              <ion-button
                fill="clear"
                @click="goToEditMember(member.id!)"
              >

                <ion-icon
                  :icon="createOutline"
                ></ion-icon>

              </ion-button>

            </ion-item>


            <!-- SWIPE OPTIONS -->

            <ion-item-options
              side="end"
            >

              <ion-item-option
                color="danger"
                @click="removeMember(member.id!)"
              >

                <ion-icon
                  :icon="trashOutline"
                  slot="icon-only"
                ></ion-icon>

              </ion-item-option>

            </ion-item-options>

          </ion-item-sliding>

        </ion-list>

      </div>

    </ion-content>

  </ion-page>

</template>


<script setup lang="ts">

import {
  computed,
  ref
} from 'vue'


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSpinner
} from '@ionic/vue'


import {
  addOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons'


import {
  useRouter
} from 'vue-router'


import {
  useMembers
} from '../composables/useMembers'


import {
  deleteMember
} from '../services/memberService'


const router = useRouter()


const {
  members,
  loading
} = useMembers()


const searchText = ref('')


// SEARCH FILTER

const filteredMembers = computed(() => {

  const search = searchText.value
    .toLowerCase()
    .trim()


  if (!search) {

    return members.value

  }


  return members.value.filter(
    (member) =>

      member.name
        .toLowerCase()
        .includes(search)

      ||

      member.memberId
        .toLowerCase()
        .includes(search)

      ||

      member.course
        .toLowerCase()
        .includes(search)

      ||

      member.position
        .toLowerCase()
        .includes(search)
  )

})


// GO TO ADD

const goToAddMember = () => {

  router.push('/members/add')

}


// GO TO EDIT

const goToEditMember = (
  id: string
) => {

  router.push(
    `/members/edit/${id}`
  )

}


// DELETE

const removeMember = async (
  id: string
) => {

  const confirmed = confirm(
    'Are you sure you want to delete this member?'
  )


  if (!confirmed) {
    return
  }


  try {

    await deleteMember(id)

    alert(
      'Member deleted successfully.'
    )

  } catch (error) {

    console.error(
      'Delete error:',
      error
    )

    alert(
      'Failed to delete member.'
    )

  }

}

</script>


<style scoped>

.page-container {
  padding: 16px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
}

.empty {
  text-align: center;
  padding: 50px 20px;
}

ion-list {
  margin-top: 20px;
}

ion-item {
  --padding-top: 10px;
  --padding-bottom: 10px;
}

ion-label h2 {
  font-weight: bold;
  margin-bottom: 8px;
}

ion-label p {
  margin: 4px 0;
}

</style>