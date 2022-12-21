<script lang="ts" setup>
import { reactive } from 'vue'
import FormInput from './Form/FormInput.vue'
import FormSelect from './Form/FormSelect.vue'
import SidebarItem from './SidebarItem.vue'

const config = reactive({
  text: {
    fontSize: 0,
  },
})
</script>

<template>
  <div class="sidebar">
    <ul class="icons">
      <SidebarItem title="Font">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-fonts"
            viewBox="0 0 16 16"
          >
            <path
              d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z"
            />
          </svg>
        </template>
        <template #submenu>
          <div class="grid two-cols">
            <FormInput v-model="config.text.fontSize" name="font-size" type="number" label="Font Size" />
            <div class="form-group">
              <label for="font-style">Alignment</label>
              <div class="flex">
                <input id="align-left" type="radio" class="radio-hidden" name="custom-text-align">
                <label for="align-left" href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-text-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </label>

                <input id="align-center" type="radio" class="radio-hidden" name="custom-text-align">
                <label for="align-center" href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-text-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </label>

                <input id="align-right" type="radio" class="radio-hidden" name="custom-text-align">
                <label for="align-right" href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-text-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </label>
              </div>
            </div>
          </div>
          <FormSelect
            :data="['Lora',
                    'Arial',
                    'Helvetica',
                    'Verdana',
                    'Times new roman',
                    'Garamond',
                    'Comic Sans MS',
                    'New Courier',
                    'Georgia',
                    'Lucida Console',
                    'Tahoma']"
          />
          <div class="form-group">
            <label for="font-style">Font Family</label>
            <select id="custom-font-family" name="font-family" class="form-input">
              <option value="Lora">
                Lora
              </option>
              <option value="Arial">
                Arial
              </option>
              <option value="Helvetica">
                Helvetica
              </option>
              <option value="Verdana">
                Verdana
              </option>
              <option value="Times New Roman">
                Times New Roman
              </option>
              <option value="Garamond">
                Garamond
              </option>
              <option value="Comic Sans MS">
                Comic Sans MS
              </option>
              <option value="Courier New">
                Courier New
              </option>
              <option value="Georgie">
                Georgie
              </option>
              <option value="Lucida Console">
                Lucida Console
              </option>
              <option value="Tahoma">
                Tahoma
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="font-style">Color</label>
            <input id="custom-text-color" type="color" class="form-input">
          </div>
        </template>
      </SidebarItem>
      <SidebarItem title="Shape">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-heptagon"
            viewBox="0 0 16 16"
          >
            <path
              d="M7.779.052a.5.5 0 0 1 .442 0l6.015 2.97a.5.5 0 0 1 .267.34l1.485 6.676a.5.5 0 0 1-.093.415l-4.162 5.354a.5.5 0 0 1-.395.193H4.662a.5.5 0 0 1-.395-.193L.105 10.453a.5.5 0 0 1-.093-.415l1.485-6.676a.5.5 0 0 1 .267-.34L7.779.053zM2.422 3.813l-1.383 6.212L4.907 15h6.186l3.868-4.975-1.383-6.212L8 1.058 2.422 3.813z"
            />
          </svg>
        </template>
        <template #submenu>
          <div>
            <div class="form-group">
              <label for="font-style">Shape</label>
              <div class="flex gap-2">
                <a href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                    />
                  </svg>
                </a>
                <a href="#" class="btn btn-active">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-diamond"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"
                    />
                  </svg>
                </a>
                <a href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  </svg>
                </a>
                <a href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hexagon"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 4.577v6.846L8 15l-6-3.577V4.577L8 1l6 3.577zM8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z"
                    />
                  </svg>
                </a>
                <a href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    class="bi bi-triangle" viewBox="0 0 16 16"
                  >
                    <path
                      d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div class="grid two-cols">
              <div class="form-group">
                <label for="custom-background-color">Background Color</label>
                <input id="custom-background-color" type="color" class="form-input">
              </div>
              <div class="form-group">
                <label for="custom-hover-background-color">Background Color</label>
                <input id="custom-hover-background-color" type="color" class="form-input">
              </div>
            </div>
            <div class="grid two-cols">
              <div class="form-group">
                <label for="custom-border-color">Border Color</label>
                <input id="custom-border-color" type="color" class="form-input">
              </div>
              <div class="form-group">
                <label for="custom-border-hover-color">Border Hover Color</label>
                <input id="custom-hover-border-color" type="color" class="form-input">
              </div>
            </div>
            <div class="grid two-cols">
              <div class="form-group">
                <label for="custom-width">Width</label>
                <input id="custom-width" type="number" value="25" class="form-input">
              </div>
              <div class="form-group">
                <label for="custom-height">Height</label>
                <input id="custom-height" type="number" value="25" class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label for="custom-border-size">Border Size</label>
              <input id="custom-border-size" type="number" value="2" class="form-input">
            </div>
          </div>
        </template>
      </SidebarItem>
      <SidebarItem title="Line">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-slash-lg"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
            />
          </svg>
        </template>
        <template #submenu>
          <div class="sidebar-content">
            <div class="form-group">
              <label for="font-style">Line</label>
              <div class="flex gap-2">
                <a href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                    />
                  </svg>
                </a>
                <a href="#" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div class="grid two-cols">
              <div class="form-group">
                <label for="custom-background-color">Background Color</label>
                <input id="line-background-color" type="color" class="form-input">
              </div>
              <div class="form-group">
                <label for="custom-hover-background-color">Background Hover Color</label>
                <input id="line-hover-background-color" type="color" class="form-input">
              </div>
            </div>
            <div class="grid two-cols">
              <div class="form-group">
                <label for="custom-border-color">Border Color</label>
                <input id="line-border-color" type="color" class="form-input">
              </div>
              <div class="form-group">
                <label for="custom-border-hover-color">Border Hover Color</label>
                <input id="line-hover-border-color" type="color" class="form-input">
              </div>
            </div>
            <div class="grid two-cols">
              <div class="form-group">
                <label for="custom-width">Width</label>
                <input id="line-width" type="number" value="25" class="form-input">
              </div>
              <div class="form-group">
                <label for="custom-height">Height</label>
                <input id="line-height" type="number" value="25" class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label for="custom-border-size">Border Size</label>
              <input id="line-border-size" type="number" value="2" class="form-input">
            </div>
          </div>
        </template>
      </SidebarItem>
      <SidebarItem title="Color">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#e74c3c" stroke="currentColor"
            class="bi bi-circle-fill" viewBox="0 0 16 16"
          >
            <circle cx="8" cy="8" r="7.5" />
          </svg>
        </template>
        <!-- <template #submenu>
        </template> -->
      </SidebarItem>
      <SidebarItem title="Visibility">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-eye"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
            />
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
          </svg>
        </template>
        <!-- <template #submenu>
        </template> -->
      </SidebarItem>
    </ul>
  </div>
</template>
