<template>
    <div>
      <div class="backdrop">
          <div class="container">
              <div>
                  <h3>Course Registration</h3>
                  <div>
                      <table>
                          <tr>
                              <td>Select Course</td>
                              <td>
                                  <select v-model="selectedCourse">
                                    <option v-for="course in dataList" :key="course.lec_id" :value="course.lec_id">
                                        {{ course.lec_name }}
                                    </option>
                                  </select>
                              </td>
                          </tr>
                      </table>
                  </div>
                  <div>
                      <button class="btn btn-light"  @click="registerLecture(props.loginID)">Register</button>
                      <button type="button" class="btn btn-light" @click="$emit('closeModal', false)">Close</button>
                  </div>
              </div>
          </div>
      </div>
    </div>
</template>

<script setup>
  import { onMounted, inject, ref } from 'vue';
  import axios from 'axios';
  const dataList = inject('dataList');
  const emit = defineEmits(['closeModal', 'closeAndSearch']);
  const props = defineProps({
    loginID: Number,
  });

  const selectedCourse = ref(); // 새로운 ref 추가
 
//   watch(props.dataList, (newValue) => {
//     console.log("Received dataList:", newValue);
//   }, { immediate: true });

  const registerLecture = () => {
    let param = new URLSearchParams();
    param.append('std_id', props.loginID);
    param.append('lec_id', selectedCourse.value); // selectedCourse에서 lec_id 가져오도록 수정
    axios.post('/adm/std_lec_reg.do', param).then((res) => {
      if (res.data.result === 'SUCCESS') {
        alert(res.data.resultMsg);
        emit('closeAndSearch', false);
      }
    }).catch((error) => {
      console.error("Error registering lecture:", error);
    });
  };

  onMounted(() => {
    if (props.loginID) {
      registerLecture();
    }
  });
</script>

<style>
  .backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .container {
    background: white;
    padding: 1.5rem;
    height: 50%;
  }
</style>
