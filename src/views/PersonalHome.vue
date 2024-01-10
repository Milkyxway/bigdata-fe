<template>
  <router-view v-slot="{ Component }"
    ><keep-alive include="tasklist"><component :is="Component" /></keep-alive
  ></router-view>
</template>
