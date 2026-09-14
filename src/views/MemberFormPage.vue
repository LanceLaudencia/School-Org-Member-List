<template>  
  <ion-page>  
    <ion-header>  
      <ion-toolbar>  
        <ion-buttons slot="start">  
          <ion-back-button default-href="/members" />  
        </ion-buttons>  
        <ion-title>{{ isEditMode ? 'Edit Member' : 'Add Member' }}</ion-title> <!-- Add or Edit --> 
      </ion-toolbar>  
    </ion-header>  
  
    <ion-content>  
      <div class="form-container">  
  
        <div class="form-header">  
          <div class="header-icon">  
            <ion-icon :icon="isEditMode ? createOutline : personAddOutline" />  
          </div>  
          <div>  
            <h1>{{ isEditMode ? 'Edit Member' : 'New Member' }}</h1>  
            <p>{{ isEditMode ? 'Update organization member information.' : 'Add a new organization member.' }}</p>  
          </div>  
        </div>  
  
        <ion-item>  
          <ion-icon :icon="cardOutline" slot="start" />  
          <div class="member-id-field">  
            <label>Member ID</label>  
            <div class="member-id-input">  
              <span class="mcc-prefix">MCC</span>  
              <ion-input  
                placeholder="2023-00825"  
                type="text"  
                inputmode="numeric"  
                :maxlength="10"  
                :value="memberIdNumber"  
                @keydown="memberIdKeydown"  
                @ionInput="handleMemberId"  
              />  
            </div>  
          </div>  
        </ion-item>  
  
        <ion-item>  
          <ion-icon :icon="personOutline" slot="start" />  
          <ion-input  
            label="Full Name"  
            label-placement="stacked"  
            placeholder="MARQUEZ, KAYE M."  
            v-model="form.name"  
            @keydown="nameKeydown"  
            @ionInput="handleName"  
          />  
        </ion-item>  
  
        <ion-item>  
          <ion-icon :icon="schoolOutline" slot="start" />  
          <ion-select label="Course" label-placement="stacked"  
            placeholder="Select course" v-model="form.course">  
            <ion-select-option v-for="course in courses" :key="course" :value="course">  
              {{ course }}  
            </ion-select-option>  
          </ion-select>  
        </ion-item>  
  
        <ion-item>  
          <ion-icon :icon="calendarOutline" slot="start" />  
          <ion-select label="Year Level" label-placement="stacked"  
            placeholder="Select year level" v-model="form.yearLevel">  
            <ion-select-option v-for="year in years" :key="year" :value="year">  
              {{ year }}  
            </ion-select-option>  
          </ion-select>  
        </ion-item>  
  
        <ion-item>  
          <ion-icon :icon="ribbonOutline" slot="start" />  
          <ion-input  
            label="Organization Position"  
            label-placement="stacked"  
            placeholder="Enter position"  
            v-model="form.position"  
            @keydown="positionKeydown"  
            @ionInput="handlePosition"  
          />  
        </ion-item>  
  
        <ion-item>  
          <ion-icon :icon="callOutline" slot="start" />  
          <div class="phone-field">  
            <label>Contact Information</label>  
            <div class="phone-input">  
              <span class="country-code">+63</span>  
              <ion-input  
                placeholder="9853784196"  
                type="text"  
                inputmode="numeric"  
                :maxlength="10"  
                :value="phoneNumber"  
                @keydown="phoneKeydown"  
                @ionInput="handlePhoneInput"  
              />  
            </div>  
          </div>  
        </ion-item>  
  
        <ion-button expand="block" class="save-button"  
          :disabled="isSaving" @click="save"> <!-- Save or Update --> 
          <ion-icon :icon="saveOutline" slot="start" />  
          {{ isSaving ? 'Saving...' : isEditMode ? 'Update Member' : 'Save Member' }}  
        </ion-button>  
  
        <ion-button expand="block" fill="outline" class="cancel-button"  
          :disabled="isSaving" @click="goBack">  
          <ion-icon :icon="closeOutline" slot="start" />  
          Cancel  
        </ion-button>  
  
      </div>  
    </ion-content>  
  </ion-page>  
</template>  
  
<script setup lang="ts">  
import { computed, onMounted, ref } from 'vue' // Vue functions
import { useRoute, useRouter } from 'vue-router' // Page navigation
import {  
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,  
  IonBackButton, IonItem, IonInput, IonSelect, IonSelectOption,  
  IonButton, IonIcon  
} from '@ionic/vue' // Ionic components
import {  
  personAddOutline, createOutline, cardOutline, personOutline,  
  schoolOutline, calendarOutline, ribbonOutline, callOutline,  
  saveOutline, closeOutline  
} from 'ionicons/icons' // Icons
import type { Member } from '../types/Member' // Member data
import { addMember, updateMember } from '../services/memberService' // Add and update data
import { ref as firebaseRef, get } from 'firebase/database' // Get Firebase data
import { db } from '../firebase/config' // Firebase database
  
const router = useRouter()  
const route = useRoute()  
  
const memberId = computed(() => route.params.id as string | undefined) // Gets member ID
const isEditMode = computed(() => !!memberId.value) // Checks Add or Edit
  
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']  
const courses = ['BSIT', 'BSCRIM', 'BTVTED/BTLED', 'BSED', 'AB', 'CBM']  
  
const form = ref<Member>({ // Stores member data
  memberId: '', name: '', course: '', yearLevel: '', position: '', contact: ''  
})  
  
const isSaving = ref(false)  
const memberIdNumber = ref('')  
const phoneNumber = ref('')  
  
const memberIdKeydown = (e: KeyboardEvent) => { // Checks Member ID input
  const keys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End']  
  if (keys.includes(e.key)) return  
  if (/[0-9]/.test(e.key)) {  
    if (memberIdNumber.value.length >= 10) e.preventDefault()  
    return  
  }  
  if (e.key === '-' && memberIdNumber.value.length === 4) return  
  e.preventDefault()  
}  
  
const handleMemberId = (e: CustomEvent) => { // Formats Member ID
  const value = String(e.detail.value || '').replace(/[^0-9-]/g, '')  
  const digits = value.replace(/\D/g, '')  
  const year = digits.slice(0, 4)  
  const number = digits.slice(4, 9)  
  
  memberIdNumber.value = year.length === 4 ? `${year}-${number}` : year 
  form.value.memberId = `MCC${memberIdNumber.value}` 
}  
  
const nameKeydown = (e: KeyboardEvent) => { // Checks name input
  const keys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End',' ', ',', '.', '-', "'"]  
  if (keys.includes(e.key) || /^[a-zA-ZñÑ]$/.test(e.key)) return  
  e.preventDefault()  
}  
  
const handleName = (e: CustomEvent) => {  
  form.value.name = String(e.detail.value || '') 
    .toUpperCase().replace(/[^A-ZÑ ,. '-]/g, '') 
}  
  
const positionKeydown = (e: KeyboardEvent) => { // Checks position input
  const keys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End',' ', ',', '.', '-', "'", '/']  
  if (keys.includes(e.key) || /^[a-zA-ZñÑ]$/.test(e.key)) return  
  e.preventDefault()  
}  
  
const handlePosition = (e: CustomEvent) => {  
  form.value.position = String(e.detail.value || '') 
    .toUpperCase().replace(/[^A-ZÑ ,.\/'-]/g, '') 
}  
  
const phoneKeydown = (e: KeyboardEvent) => { // Checks phone input
  const keys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End']  
  if (keys.includes(e.key)) return  
  
  if (!/[0-9]/.test(e.key) ||  
      (phoneNumber.value.length === 0 && e.key !== '9') ||  
      phoneNumber.value.length >= 10) {  
    e.preventDefault()  
  }  
}  
  
const handlePhoneInput = (e: CustomEvent) => {  
  let value = String(e.detail.value || '').replace(/\D/g, '').slice(0, 10)  
  if (value && value[0] !== '9') value = ''  
  
  phoneNumber.value = value  
  form.value.contact = value ? `+63${value}` : ''  
}  
  
const loadMember = async () => { // Loads member data
  if (!memberId.value) return  
  
  try {  
    const snapshot = await get(firebaseRef(db, `members/${memberId.value}`))  
  
    if (!snapshot.exists()) {  
      alert('Member not found.')  
      router.push('/members')  
      return  
    }  
  
    form.value = { id: memberId.value, ...snapshot.val() }  
  
    const savedId = form.value.memberId || ''  
    if (savedId.toUpperCase().startsWith('MCC')) {  
      memberIdNumber.value = savedId.substring(3).slice(0, 10)  
    }  
  
    const contact = form.value.contact || ''  
    phoneNumber.value = contact.startsWith('+63')  
      ? contact.replace('+63', '').replace(/\D/g, '').slice(0, 10)  
      : contact.replace(/^0/, '').replace(/\D/g, '').slice(0, 10)  
  
  } catch (error) {  
    console.error(error)  
    alert('Failed to load member.')  
  }  
}  
  
const checkDuplicate = async (): Promise<boolean> => { // Checks duplicate data
  try {  
    const snapshot = await get(firebaseRef(db, 'members'))  
    if (!snapshot.exists()) return false  
  
    const enteredId = form.value.memberId.trim().toUpperCase()  
    const enteredName = form.value.name.trim().toUpperCase()  
    const enteredContact = form.value.contact.trim()  
  
    let idDuplicate = false  
    let nameDuplicate = false  
    let contactDuplicate = false  
  
    for (const [id, data] of Object.entries(snapshot.val())) {  
      if (isEditMode.value && id === memberId.value) continue  
  
      const member = data as Member  
  
      if (String(member.memberId || '').trim().toUpperCase() === enteredId) 
        idDuplicate = true  
  
      if (String(member.name || '').trim().toUpperCase() === enteredName) 
        nameDuplicate = true  
  
      if (String(member.contact || '').trim() === enteredContact) 
        contactDuplicate = true  
    }  
  
    if (idDuplicate && nameDuplicate && contactDuplicate) {  
      alert(`Member ID ${enteredId}, name ${enteredName}, and contact number ${enteredContact} are already registered. Please use different information.`)  
      return true  
    }  
  
    if (idDuplicate && nameDuplicate) {  
      alert(`Member ID ${enteredId} and name ${enteredName} are already registered. Please use different information.`)  
      return true  
    }  
  
    if (idDuplicate && contactDuplicate) {  
      alert(`Member ID ${enteredId} and contact number ${enteredContact} are already registered. Please use different information.`)  
      return true  
    }  
  
    if (nameDuplicate && contactDuplicate) {  
      alert(`Name ${enteredName} and contact number ${enteredContact} are already registered. Please use different information.`)  
      return true  
    }  
  
    if (idDuplicate) {  
      alert(`Member ID ${enteredId} is already registered. Please use a different Member ID.`)  
      return true  
    }  
  
    if (nameDuplicate) {  
      alert(`Name ${enteredName} is already registered. Please use a different name.`)  
      return true  
    }  
  
    if (contactDuplicate) {  
      alert(`Contact number ${enteredContact} is already registered. Please use a different contact number.`)  
      return true  
    }  
  
    return false  
  } catch (error) {  
    console.error(error)  
    alert('Unable to check existing members. Please try again.')  
    return true  
  }  
}  
  
const clearForm = () => { // Clears the form
  form.value = {  
    memberId: '', name: '', course: '', yearLevel: '', position: '', contact: ''  
  }  
  memberIdNumber.value = ''  
  phoneNumber.value = ''  
}  
  
const save = async () => { // Saves member data
  if (isSaving.value) return  
  
  const { memberId: id, name, course, yearLevel, position } = form.value  
  
  if (!id || !name || !course || !yearLevel || !position || !phoneNumber.value) { // Checks required fields
    alert('Please complete all fields.')  
    return  
  }  
  
  if (!/^MCC\d{4}-\d{5}$/.test(id)) { // Checks Member ID
    alert('Member ID must follow this format: MCC2023-00825')  
    return  
  }  
  
  if (!/^[A-ZÑ][A-ZÑ .'-]*,\s[A-ZÑ][A-ZÑ .'-]*$/.test(name)) { // Checks name format
    alert('Name must follow this format: LAST NAME, FIRST NAME M.')  
    return  
  }  
  
  if (!/^[A-ZÑ][A-ZÑ ,.\/'-]*$/.test(position)) { // Checks position format
    alert('Organization Position must contain letters only.')  
    return  
  }  
  
  if (!/^9\d{9}$/.test(phoneNumber.value)) { // Checks phone number
    alert('Contact number must contain 10 digits and start with 9.')  
    return  
  }  
  
  form.value.contact = `+63${phoneNumber.value}`  
  
  if (await checkDuplicate()) return // Stops duplicate data
  
  isSaving.value = true  
  
  try {  
    if (isEditMode.value) {  
      await updateMember(memberId.value!, form.value) // Updates member
      alert('Member updated successfully.')  
    } else {  
      await addMember(form.value) // Adds member
      alert('Member added successfully.')  
      clearForm()  
    }  
  
    await router.push('/members')  
  } catch (error) {  
    console.error(error)  
    alert('Failed to save member.')  
  } finally {  
    isSaving.value = false  
  }  
}  
  
const goBack = () => { // Goes back to Members
  if (!isSaving.value) router.push('/members')  
}  
  
onMounted(loadMember) // Loads data when page opens
</script>  
  
<style scoped>  
ion-header, ion-toolbar { --background: #0f3d2e; --color: white; }  
ion-title { font-family: monospace; font-weight: bold; }  
ion-content { --background: #eef8f1; }  
  
.form-container { padding: 18px; max-width: 650px; margin: auto; }  
  
.form-header {  
  display: flex; align-items: center; gap: 15px;  
  background: #d8f3df; border: 1.5px solid #111;  
  border-radius: 12px; padding: 18px; margin-bottom: 20px;  
}  
  
.header-icon {  
  width: 50px; height: 50px; min-width: 50px;  
  display: grid; place-items: center;  
  background: #176b45; border: 1.5px solid #111; border-radius: 10px;  
}  
  
.header-icon ion-icon { color: white; font-size: 26px; }  
  
.form-header h1 { font: bold 20px monospace; color: #0f3d2e; margin: 0 0 5px; }  
.form-header p { font: 12px monospace; color: #315c48; margin: 0; }  
  
ion-item {  
  --background: white; --border-color: #111;  
  --border-width: 1.5px; --border-style: solid;  
  --border-radius: 10px; --padding-start: 12px;  
  margin-bottom: 12px; font-family: monospace;  
}  
  
ion-item ion-icon { color: #176b45; font-size: 21px; margin-right: 8px; }  
ion-input, ion-select { font-family: monospace; }  
  
.member-id-field, .phone-field { width: 100%; padding: 8px 0; }  
.member-id-field label, .phone-field label {  
  display: block; font: bold 12px monospace; color: #315c48; margin-bottom: 5px;  
}  
  
.member-id-input, .phone-input { display: flex; align-items: center; width: 100%; }  
  
.mcc-prefix, .country-code {  
  font: bold 16px monospace; color: #0f3d2e;  
  margin-right: 8px; padding-right: 8px; border-right: 1px solid #111;  
}  
  
.member-id-input ion-input, .phone-input ion-input {  
  flex: 1; --padding-start: 0;  
}  
  
.save-button {  
  margin-top: 25px; --background: #176b45;  
  --border-radius: 10px; --border-color: #111;  
  --border-width: 1.5px; --border-style: solid;  
  --box-shadow: 3px 3px 0 #111;  
  font-family: monospace; font-weight: bold;  
}  
  
.cancel-button {  
  margin-top: 12px; --color: #176b45;  
  --border-color: #111; --border-width: 1.5px;  
  --border-radius: 10px; font-family: monospace; font-weight: bold;  
}  
</style>