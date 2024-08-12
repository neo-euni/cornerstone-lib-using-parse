<template>
    <q-page class="q-pa-none">
        <div class="body-container">
            <div class="main-content-area">
                <div class="folder-section">
                    <div class="content-header">
                        <div class="patient-info-label">
                           Patient Information
                        </div>
                    </div>
                    <div class="patient-info-value">
                        <div class="q-pa-md left-align-container" style="max-width: 350px">
                            <q-list>
                                <q-item>
                                    <q-item-section>
                                    <q-item-label class="left-align">name</q-item-label>
                                    <q-item-label caption lines="2" class="left-align">Rubo DEMO</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-separator spaced inset />
                                <q-item>
                                    <q-item-section>
                                    <q-item-label class="left-align">ID</q-item-label>
                                    <q-item-label caption lines="2" class="left-align">322.292.73.6</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-separator spaced inset />
                                <q-item>
                                    <q-item-section>
                                    <q-item-label class="left-align">birth date</q-item-label>
                                    <q-item-label caption lines="2" class="left-align">19-July-1958</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-separator spaced inset />
                                <q-item>
                                    <q-item-section>
                                    <q-item-label class="left-align">sex</q-item-label>
                                    <q-item-label caption lines="2" class="left-align">F</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-separator spaced inset />
                            </q-list>
                            
                        </div>
                    </div>
                </div>
                <div class="patient-info-image-section">
                    <div class="content-header">
                        <div class="folder-open-area">
                            <q-file outlined v-model="model" class="custom-q-file">
                                <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                    <div class="placeholder-text">Open File</div>
                                </template>
                            </q-file>
                        </div>
                    </div>
                    <div class="dicom-image-section">
                        <img src="./../assets/images/dicom.jpg" alt="Dicom Image">
                    </div>
                </div>
                <div class="tab-parse-section">
                    <div class="content-header">
                        <div class="tag-search">
                            <q-input 
                                outlined
                                v-model="text"
                                label="tag search"
                            >
                                <template v-slot:append>
                                    <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
                                    <q-icon style="color: var(--color-secondary);" name="search" />
                                </template>
                            </q-input>
                          </div>
                        </div>
                    <div class="tab-content">
                        <q-tabs
                        class="custom-tabs"
                        v-model="tab"
                        dense
                    >
                        <q-tab name="study" label="Study" />
                        <q-tab name="series" label="Series" />
                        <q-tab name="image" label="Image" />
                        <q-tab name="equipment" label="Equipment" />
                        <q-tab name="additional" label="Addition" />
                        </q-tabs>
                    </div>
                    <div class="horizontal-container">
                        <div class="tag-area">
                            <div class="tag-label">
                                TAG Description
                            </div>
                            <div class="tag-list">
                                <div class="tag-item"> Study Date</div>
                                <div class="tag-item"> Study Time</div>
                                <div class="tag-item"> Study Modality</div>
                                <div class="tag-item"> Study Description</div>
                            </div>
                        </div>
                        <div class="value-area">
                            <div class="value-label">Value</div>
                            <div class="value-list">
                                <div class="value-item">25-Marck-1993</div>
                                <div class="value-item">13:57;31</div>
                                <div class="value-item">XA</div>
                                <div class="value-item">8 images of 4</div>
                            </div>
                        </div>
                    </div>
                  
                </div>
            </div>
        </div>
    </q-page>
</template>

<script lang = "ts">
export default {
  data() {
    return {
      tab: 'study',
      text: '',
      dense: false,
      model: null,
    }
  }
}
</script>
  
<style scoped>
    .body-container {
    max-height: calc(100vh - 103.72px);
    height: 100vh;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    }

    .main-content-area {
    display: flex;
    width: 1280px;
    /* height: 976.28px; */
    max-width: 100%;
    margin: auto;
    overflow: auto;
    box-sizing: border-box;
    }

    .folder-section {
    width: 168px;
    box-sizing: border-box;
    }

    .custom-q-file .placeholder-text {
    color: var(--color-quaternary opacity(0.5));
    font-size: 16px;
    }

    .patient-info-image-section {
    width: 675px;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0px 10px;
    }

    .dicom-image-section {
    width: 100%;
    height: 710px;
    overflow: hidden;
    box-sizing: border-box;
    border: 0.125rem solid var(--color-primary);
    box-shadow: 0px 0px 10px 0px var(--color-quaternary);
    object-position: center;
    border-radius: 5px;
    display: block;
    }

    .dicom-image-section img{  
    width: 100%;
    height: 100%;
    object-fit: cover;
    }

    .patient-info-value {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    height: 710px;
    background-color: var(--color-section-background);
    border-radius: 5px;
    display: flex; 
    justify-content: center; 
    }

    .patient-info-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    background-color: var(--color-primary);
    height: 100%;
    padding: 10px;
    font-weight: 600;
    }

    .folder-open-area {
    width: 100%;
    height: 70px;
    background-color: var(--color-section-background);
    border-radius: 5px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 7px;
    }

    .tab-parse-section {
    width: 438px;
    box-sizing: border-box;
    }

    .tab-content {
    width: 100%;
    height: 35px;
    }

    .horizontal-container {
    display: flex;
    flex-direction: row;
    height: 675px;
    width: 100%;
    }

    .tag-area {
    flex: 4;
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content: center;
    margin-right: 5px;
    
    }
    .value-area {
    flex: 6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
    }

    .custom-tabs {
    background-color: var(--color-quaternary);
    border-bottom: 2px solid var(--color-secondary);
    border-radius: 5px;
    }
    .custom-tabs .q-tab {
    color: var(--color-secondary);
    font-weight: bold;
    position: relative;
    border-radius: 5px;
    }

    .custom-tabs .q-tab:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 12px;
    height: 16px;
    width: 1px;
    background-color: var(--color-secondary);
    }

    .custom-tabs .q-tab--active {
    background-color: var(--color-secondary);
    color: var(--color-quaternary);
    }

    .custom-tabs .q-tabs--indicator {
    background-color: var(--color-primary);
    }

    .content-header { 
    width:100%;
    height: 70px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .tag-list, .value-list {
    flex:1;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    background-color: var(--color-section-background);
    }

    .tag-item {
    flex-direction: row;
    gap:10px;
    font-weight: 500;
    margin-bottom: 5px;
    justify-self: start;
    }

    .tag-search {
    width: 100%;
    max-height: 100%;
    height: auto;
    }

    .value-item {
    flex-direction: row;
    margin-bottom: 5px;
    font-weight: 400;
    justify-self: start;
    gap:10px;
    }

    .tag-label, .value-label {
    font-weight:600;
    width: 100%;
    font-size: 1.1em;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 15px;
    background-color: var(--color-primary);
    }
</style>
  