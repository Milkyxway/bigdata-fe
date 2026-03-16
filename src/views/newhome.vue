<template>
  <router-view v-slot="{ Component }"
    ><keep-alive include="list"><component :is="Component" /></keep-alive
  ></router-view>
</template>
