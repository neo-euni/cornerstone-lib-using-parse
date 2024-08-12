<template>
  <q-header elevated class="q-header custom-header">
    <q-toolbar>
      <q-btn flat icon="dashboard" class="q-mr-sm" size="1.5rem" />
      <q-toolbar-title class="title-bold">Dicom Viewer</q-toolbar-title>
      <q-btn dense flat icon="menu" @click="toggleRightDrawer" />
    </q-toolbar>
  </q-header>

  <q-drawer
    v-model="rightDrawerOpen"
    :width="200"
    side="right"
    overlay
    @input="onDrawerStateChange"
    style="background-color: var(--color-quaternary); color: var(--color-secondary);"
  >
    <q-list padding class="menu-list">
      <q-item
        v-for="(item, index) in items"
        :key="index"
        clickable
        v-ripple
        :class="{ 'selected-item': selectedItem === index }"
        @click="selectItem(index)"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>

<div
    v-if="rightDrawerOpen"
    class="backdrop"
    @click="closeRightDrawer"
  ></div>
</template>

<script lang = "ts">
import { ref, Ref } from 'vue';

interface Item {
      label: string;
      icon: string;
    }
    
export default {
  setup() {
    const rightDrawerOpen: Ref<boolean> = ref(false);
    const selectedItem: Ref<number| null> = ref(null);

    const items: Ref<Item[]> = ref([
      { label: 'Inbox', icon: 'inbox' },
      { label: 'Star', icon: 'star' },
      { label: 'Send', icon: 'send' },
      { label: 'Drafts', icon: 'drafts' }
    ]);

    const selectItem = (index: number): void => {
      selectedItem.value = index;
    };

    // drawer가 열려 있으면 닫고, 닫혀 있으면 여는 함수
    const toggleRightDrawer = (): void => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };
    
    // 빈 화면이 클릭되거나, 다른 page로 넘어갈 때 강제로drawer 닫는 함수
    const closeRightDrawer = (): void => {
      rightDrawerOpen.value = false;
    };

    // drawer 상태 변경 시 실행되는 함수
    const onDrawerStateChange = (state: boolean): void => {
      rightDrawerOpen.value = state;
    };

    return {
      rightDrawerOpen,
      toggleRightDrawer,
      closeRightDrawer,
      selectedItem,
      items,
      selectItem,
      onDrawerStateChange
    };
  }
};
</script>

<style scoped>
.custom-header {
  background-color: var(--color-primary);
  color: var(--color-quaternary);
  padding: 20px;
  border-bottom: 2px solid #c4ac89;
  height: 103.72px;
}

.title-bold {
  font-weight: bold;
  font-size: 2rem;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 998;
}

.selected-item {
  background-color: var(--color-secondary);
  color: var(--color-quaternary);
}
</style>
