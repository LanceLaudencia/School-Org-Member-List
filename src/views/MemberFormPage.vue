<template>

  <ion-page>

    <ion-header>

      <ion-toolbar>

        <ion-buttons slot="start">

          <ion-back-button
            default-href="/members"
          ></ion-back-button>

        </ion-buttons>


        <ion-title>
          {{ isEditMode ? 'Edit Member' : 'Add Member' }}
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <ion-content>

      <div class="form-container">

        <ion-item>

          <ion-input
            label="Member ID"
            label-placement="stacked"
            placeholder="Enter member ID"
            v-model="form.memberId"
          ></ion-input>

        </ion-item>


        <ion-item>

          <ion-input
            label="Full Name"
            label-placement="stacked"
            placeholder="Enter full name"
            v-model="form.name"
          ></ion-input>

        </ion-item>


        <ion-item>

          <ion-input
            label="Course"
            label-placement="stacked"
            placeholder="Example: BSIT"
            v-model="form.course"
          ></ion-input>

        </ion-item>


        <ion-item>

          <ion-select
            label="Year Level"
            label-placement="stacked"
            placeholder="Select year level"
            v-model="form.yearLevel"
          >

            <ion-select-option value="1st Year">
              1st Year
            </ion-select-option>

            <ion-select-option value="2nd Year">
              2nd Year
            </ion-select-option>

            <ion-select-option value="3rd Year">
              3rd Year
            </ion-select-option>

            <ion-select-option value="4th Year">
              4th Year
            </ion-select-option>

          </ion-select>

        </ion-item>


        <ion-item>

          <ion-input
            label="Organization Position"
            label-placement="stacked"
            placeholder="Example: President"
            v-model="form.position"
          ></ion-input>

        </ion-item>


        <ion-item>

          <ion-input
            label="Contact Information"
            label-placement="stacked"
            placeholder="Enter contact number"
            type="tel"
            v-model="form.contact"
          ></ion-input>

        </ion-item>


        <ion-button
          expand="block"
          class="save-button"
          @click="save"
        >

          {{ isEditMode ? 'Update Member' : 'Save Member' }}

        </ion-button>


        <ion-button
          expand="block"
          fill="outline"
          @click="goBack"
        >

          Cancel

        </ion-button>

      </div>

    </ion-content>

  </ion-page>

</template>


<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from 'vue'


import {
  useRoute,
  useRouter
} from 'vue-router'


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton
} from '@ionic/vue'


import type { Member } from '../types/Member'


import {
  addMember,
  updateMember
} from '../services/memberService'


import {
  ref as firebaseRef,
  get
} from 'firebase/database'


import { db } from '../firebase/config'


const router = useRouter()

const route = useRoute()


const memberId = computed(
  () => route.params.id as string | undefined
)


const isEditMode = computed(
  () => !!memberId.value
)


const form = ref<Member>({
  memberId: '',
  name: '',
  course: '',
  yearLevel: '',
  position: '',
  contact: ''
})


// LOAD MEMBER FOR EDITING

const loadMember = async () => {

  if (!memberId.value) {
    return
  }


  try {

    const memberRef = firebaseRef(
      db,
      `members/${memberId.value}`
    )


    const snapshot = await get(
      memberRef
    )


    if (snapshot.exists()) {

      form.value = {
        id: memberId.value,
        ...snapshot.val()
      }

    } else {

      alert(
        'Member not found.'
      )

      router.push('/members')

    }

  } catch (error) {

    console.error(
      'Load member error:',
      error
    )

    alert(
      'Failed to load member.'
    )

  }

}


// SAVE

const save = async () => {

  if (
    !form.value.memberId ||
    !form.value.name ||
    !form.value.course ||
    !form.value.yearLevel ||
    !form.value.position ||
    !form.value.contact
  ) {

    alert(
      'Please complete all fields.'
    )

    return

  }


  try {

    if (isEditMode.value) {

      await updateMember(
        memberId.value!,
        form.value
      )

      alert(
        'Member updated successfully.'
      )

    } else {

      await addMember(
        form.value
      )

      alert(
        'Member added successfully.'
      )

    }


    router.push('/members')

  } catch (error) {

    console.error(
      'Save error:',
      error
    )

    alert(
      'Failed to save member.'
    )

  }

}


// BACK

const goBack = () => {

  router.push('/members')

}


onMounted(() => {

  loadMember()

})

</script>


<style scoped>

.form-container {
  padding: 16px;
}

ion-item {
  margin-bottom: 10px;
}

.save-button {
  margin-top: 30px;
  margin-bottom: 12px;
}

</style>