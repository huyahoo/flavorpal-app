// frontend/src/store/uiStore.ts
import { defineStore } from 'pinia';

export interface UiStoreState {
  isCameraOverlayActive: boolean; // True if any full-screen camera is active
}

export const useUiStore = defineStore('ui', {
  state: (): UiStoreState => ({
    isCameraOverlayActive: false,
  }),
  actions: {
    /**
     * Sets the state indicating whether a full-screen camera overlay is active.
     * This will be used by App.vue to hide the main bottom navigation.
     * @param isActive - True if camera overlay is active, false otherwise.
     */
    setCameraOverlayActive(isActive: boolean) {
      this.isCameraOverlayActive = isActive;
      console.log('UIStore: Camera overlay active state set to ->', isActive);
    },
  },
});
