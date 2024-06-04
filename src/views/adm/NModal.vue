<template>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container" style="width: 500px">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <p class="conTitle">
                                    <span>강사 정보</span>
                                </p>
                            </div>
                            <button type="button" class="btn btn-light" @click="$emit('closeModal', false)">
                                    닫기
                            </button>
                            <table class="tutor">
                                <tr  v-show="detailProps">
                                    <td>ID</td>
                                    <td>
                                        <input
                                        v-model="tutorDetail.loginID"
                                        disabled
                                    />       
                                    </td>
                                    <td>이름</td>
                                    <td><input v-model="tutorDetail.name" disabled></td>
                                </tr>
                                <tr>
                                    <td>입사일</td>
                                    <td><input v-model="tutorDetail.join_date" disabled></td>
                                    <td>성별</td>
                                    <td><input v-model="tutorDetail.sex" disabled></td>
                                </tr>
                                <tr>
                                    <td>전화번호</td>
                                    <td><input v-model="tutorDetail.tel" disabled></td>
                                    <td>이메일</td>
                                    <td><input v-model="tutorDetail.mail" disabled></td>
                                </tr>
                                <tr>
                                    <td>주소</td>
                                    <td colspan="3"><input v-model="tutorDetail.addr" disabled></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>유저 타입</td>
                                    <td><input v-model="tutorDetail.user_type" disabled ></td>
                                    <td></td>
                                </tr>
                            </table>
                            <div  class="modal-header"> 
                                <p class="conTitle">
                                    <span>강의 정보</span>
                                </p>
                            </div>
                            <table class="lecture">
                                <tr>
                                    <td>강의ID</td>
                                    <td>강의명</td>
                                    <td>기간</td>
                                    <td>상태</td>
                                </tr>
                                <tr v-for="(lecture, i) in lectureDetail" :key="i">
                                    <td>{{ lecture.lec_id }}</td>
                                    <td>{{ lecture.lec_name }}</td>
                                    <td>{{ lecture.start_date }} ~ {{ lecture.end_date }}</td>
                                    <td>{{ lecture.status }}</td>
                                </tr>
                            </table>    
                              
                            </div>
                        </div>
                    </div>
                </div>
        </teleport>
    </div>
</template>
  
<script>
import axios from 'axios';


export default {
    props: ['detailProps', 'functionProps', 'emitProps'],
    data() {
        return {
            tutorDetail: {},
            lectureDetail: {},
        };
    },
    computed: {
        userInfo() {
            return this.$store.getters.getLoginInfo;
        },
    },
    methods: {
        getTutorDetail() {
        let param = new URLSearchParams();
        param.append('loginID', this.detailProps.loginID);
        
        axios.post('/adm/tutorView.do', param).then((res) => {
        this.tutorDetail = res.data.selinfo;      
            });
        },
        getLectureDetail() {
        let param = new URLSearchParams();
        param.append('loginID',  this.detailProps.loginID);
        param.append('user_type', this.detailProps.user_type.toLowerCase());
    
        axios.post('/adm/slist_lec_json.do', param).then((res) => {
            this.lectureDetail = res.data.tlist_lec;
         });
    },
    },
    mounted() {
        console.log(this.userInfo.userType)
    if (this.detailProps) {
      this.getTutorDetail();
      this.getLectureDetail(); // 강의 정보도 가져오기
    }
  }
}
   
   

</script>
  
  <style>
  .backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
}
.container {
    background: white;
    padding: 1.5rem;
    height: 70%;
}
table {
    width: 100%;
    border-collapse: collapse; /* 셀 간의 간격을 없애줌 */
  }

  th, td {
    border: 1px solid black; /* 셀 경계선 추가 */
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2; /* 헤더 배경색 */
  }
  </style>