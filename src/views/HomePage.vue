<template> 
  <ion-page> 
    <ion-header> 
      <ion-toolbar> 
        <ion-title> 
          <ion-icon :icon="peopleOutline" /> 
          Organization Members 
        </ion-title> 
      </ion-toolbar> 
    </ion-header> 
 
    <ion-content> 
      <div class="home-container"> 
        <div class="welcome-card"> 
          <div class="welcome-icon"> 
            <ion-icon :icon="peopleCircleOutline" /> 
          </div> 
 
          <div> 
            <h1>School Organization</h1> 
            <p>Manage and organize your members easily.</p> 
          </div> 
        </div> 
 
        <ion-button expand="block" class="members-button" @click="goToMembers"> 
          <ion-icon :icon="peopleOutline" slot="start" /> 
          View Members 
        </ion-button> 
      </div> 
    </ion-content> 
  </ion-page> 
</template> 
 
<script setup lang="ts"> 
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/vue' // Ionic components
import { peopleOutline, peopleCircleOutline } from 'ionicons/icons' // Icons
import { useRouter } from 'vue-router' // Page navigation
 
const router = useRouter() // Creates page navigation
 
const goToMembers = () => router.push('/members') // Goes to Members page
</script> 
 
<style scoped> 
ion-header, ion-toolbar { 
  --background: #0f3d2e; 
  --color: white; 
} 
 
ion-title { 
  font-family: monospace; 
  font-weight: bold; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
} 
 
ion-content { 
  --background: #eef8f1; 
} 
 
.home-container { 
  padding: 20px; 
  max-width: 650px; 
  margin: auto; 
} 
 
.welcome-card { 
  display: flex; 
  align-items: center; 
  gap: 18px; 
  background: white; 
  border: 1.5px solid #111; 
  border-radius: 14px; 
  padding: 24px; 
  margin-top: 30px; 
  box-shadow: 4px 4px 0 #111; 
} 
 
.welcome-icon { 
  width: 60px; 
  height: 60px; 
  min-width: 60px; 
  border-radius: 12px; 
  background: #d8f3df; 
  border: 1.5px solid #111; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
} 
 
.welcome-icon ion-icon { 
  font-size: 32px; 
  color: #176b45; 
} 
 
h1 { 
  font: bold 21px monospace; 
  margin: 0 0 7px; 
  color: #0f3d2e; 
} 
 
p { 
  font: 14px monospace; 
  margin: 0; 
  color: #315c48; 
  line-height: 1.5; 
} 
 
.members-button { 
  margin-top: 25px; 
  --background: #176b45; 
  --background-hover: #0f3d2e; 
  --border-radius: 10px; 
  --border-color: #111; 
  --border-width: 1.5px; 
  --border-style: solid; 
  --box-shadow: 3px 3px 0 #111; 
  font-family: monospace; 
  font-weight: bold; 
} 
</style>