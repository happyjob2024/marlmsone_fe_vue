<template>
  <div>
    <div class="backdrop">
      <div class="container mt-5">
        <div class="modal-dialog">
          <div class="modal-content p-4">
            <div>
              <h3>학생 상세 정보</h3>
              <br>
              <div class="modal-student" v-if="student">
                <table class="table table-bordered">
                  <tr>
                    <td class="font-weight-bold">ID</td>
                    <td>{{ student.loginID }}</td>
                    <td class="font-weight-bold">학번</td>
                    <td>{{ student.std_num }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">이름</td>
                    <td>{{ student.name }}</td>
                    <td class="font-weight-bold">생년월일</td>
                    <td>{{ student.regi_date }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">전화번호</td>
                    <td>{{ student.tel }}</td>
                    <td class="font-weight-bold">성별</td>
                    <td>{{ student.sex }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">이메일</td>
                    <td colspan="3">{{ student.mail }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">주소</td>
                    <td colspan="3">{{ student.addr }}</td>
                  </tr>
                </table>
              </div>
              <div class="mt-3">
                <p class="font-weight-bold">수강 내역</p>
                <button type="button" class="btn btn-primary" @click="modalHandler(props.loginID)">수강등록</button>
                <button type="button" class="btn btn-secondary" @click="$emit('closeModal', false)">닫기</button>
              </div>
              <div v-if="lecture && lecture.length" class="mt-3">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>강의ID</th>
                      <th>강의명</th>
                      <th>기간</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="lec in lecture" :key="lec.loginID">
                      <td>{{ lec.lec_id }}</td>
                      <td>{{ lec.lec_name }}</td>
                      <td>{{ lec.start_date }} ~ {{ lec.end_date }}</td>
                      <td>{{ lec.status }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="mt-3">
                <p>수강 내역이 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LectureRegi
      v-if="modalBoolean"
      :loginID="loginID"
      @closeModal="modalBoolean = $event"
      @closeAndSearch="modalClose"
    />
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref  } from 'vue';
import LectureRegi from './LectureRegi.vue';

//팝업창을 위한 변수 설정 
const  loginID = ref(0);
const modalBoolean = ref(false);

// 상위 객체에서 가져온 메소드를 실행하기 위함
const props = defineProps({
  std_num: Number,
  loginID: Number,
 
});



// 학생 상세 정보를 출력하기 위한 변수
const student = ref(null);
const lecture = ref([]); // 수강 내역은 배열로 초기화



// 학생의 상세 정보를 출력
const getStudent = () => {
  let param = new URLSearchParams();
  param.append('std_num', props.std_num);
  param.append('loginID', props.loginID);
  axios.post('/adm/user_info.do', param).then((res) => {
    if (res.data.result === 'SUCCESS') {
      alert(res.data.resultMsg);
      student.value = res.data.user_model; 
      getLecture(student.value.user_type.toLowerCase()); // 학생 정보를 가져온 후에 강의 정보를 가져옴
    }
  });
}



//수강 내역을 출력하기 위한 메소드 
const getLecture = (user_type) => {
  let param = new URLSearchParams();
  param.append('loginID', props.loginID);
  param.append('user_type', user_type); // 여기서 user_type을 전달
  axios.post('/adm/slist_lec_json.do', param).then((res) => {
    if (res.data.slist_lec) {
      lecture.value = res.data.slist_lec;
    }
  });
}

//수강 등록을 위한 메소드
const modalHandler = (param) =>  {
  console.log(param)
  modalBoolean.value = true;
    loginID.value = param;
}

//새로운 모달창 닫기
const modalClose = (param) => {
    modalBoolean.value = param;
    getLecture();
}

// 훅을 걸어서 메소드 작동
onMounted(() => {
  if (props.loginID) {
    getStudent();
  }
});
</script>

<style>
.backdrop {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.container {
  background: white;
  padding: 1.5rem;
  width: 500px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
