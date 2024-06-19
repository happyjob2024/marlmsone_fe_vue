<template>
  <teleport to="body">
      <div class="backdrop">
        <!-- 원흉 1 컨테이너 -->
          <div class="container" style="width: 500px">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <p class="conTitle">
                            <span v-if="modalProps">강의 수정</span>
                            <span v-if="!modalProps">강의 등록</span>
                          </p>
                      </div>
                      <!-- 원흉2 모달바디 -->
                      <div class="modal-body">
                        <!-- <input type="hidden" id="action" name="action" v-model="lecData.action" />  -->
                          <div class="input-group mb-3">
                              <span class="input-group-text">강의 명</span>
                              <input type="text" class="form-control" v-model="lecData.lec_name" />
                          </div>
                          <tr>
              <th scope="row">강의 분류</th>
              <td colspan="3">
                <select class="inputTxt p100" name="lec_type_id" id="lec_type_id" v-model="lecData.lec_type_id" >
                <option value="" id="">강의 분류 선택</option>
                <option v-for="(list, i) in typeList" :key="i" :value="list.lec_type_id">{{ list.lec_type_name }}</option>
              </select></td>
            </tr>

                          <!-- <div class="input-group mb-3">
                              <span class="input-group-text">강의 분류</span>
                              <input type="text" class="form-control"  />
                          </div> -->
                          <div class="input-group mb-3">
                              <span class="input-group-text">최대인원</span>
                              <input type="text" class="form-control" v-model="lecData.max_pnum"/>
                          </div>
                          <!-- <div class="input-group mb-3">
                              <span class="input-group-text" >강사명</span>
                              <input
                                  type="text"
                                  class="form-control"
                                  v-model="lecData.tutor_id"
                              />
                          </div> -->
                          <tr>
              <th scope="row">강사 명</th>
              <td colspan="3">
                <select class="inputTxt p100" name="tutor_id" id="tutor_id" v-model="lecData.tutor_id" >
                <option value="" id="">강사 선택</option>
                <option v-for="(list, i) in tutList" :key="i" :value="list.tutor_id">{{ list.t_name }}</option>
              </select></td>
            </tr>

                          <!-- <div class="input-group mb-3">
                              <span class="input-group-text">강의실 선택</span>
                              <input type="text" class="form-control"  v-model="lecData.lecrm_id"/>
                          </div> -->
                          <tr>
              <th scope="row">강의실 선택</th>
              <td colspan="3">
                <select class="inputTxt p100" name="lecrm_name" id="lecrm_name" v-model="lecData.lecrm_id" >
                <option value="" id="">강의실 선택</option>
                <option v-for="(list, i) in lecrmList" :key="i" :value="list.lecrm_id">{{ list.lecrm_name }}</option>
              </select></td>
            </tr>
                          <div class="input-group mb-3">
                              <span class="input-group-text">과정일수</span>
                              <input type="text" class="form-control" v-model="lecData.process_day"/>
                          </div>
                          <div class="input-group mb-3">
                              <span class="input-group-text">개강일</span>
                              <input type="date" class="form-control" v-model="lecData.start_date" />
                          </div>
                          <div class="input-group mb-3">
                              <span class="input-group-text">종강일</span>
                              <input type="date" class="form-control" v-model="lecData.end_date"/>
                          </div>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-info" @click="insertRegisterDetail('I')" v-show="!modalProps">
                              등록
                          </button>
                              <button type="button" class="btn btn-info" @click="insertRegisterDetail('U')" v-show="modalProps">수정</button>
                              <button type="button" class="btn btn-info" @click="delRegister">삭제</button>
                          <button type="button" class="btn btn-light" @click="$emit('closeModal', false)">
                              닫기
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </teleport>
</template>

<script>
import axios from "axios";

export default {
  props: ["getRegisterList", "modalProps", "currentPage"],
  data() {
    return {
      lecData: {},
      // lecInfo: {},
      lecrmList: [],
      tutList: [],
      typeList: [],
    };
  },
  // computed: {
  //   userInfo() {
  //     return this.$store.getters.getLoginInfo;
  //   },
  // },
  methods: {
    insertRegisterDetail(action) {
      let param = new URLSearchParams(this.lecData);
      console.log(this.lecData)
      // param.append("loginID", this.userInfo.loginId);
      param.append("action", action);
      
      axios.post("/register/saveRegister.do", param).then((res) => {
        if (res.data.result === "S") {
          alert(res.data.resultMsg);
          this.$emit("closeModal", false);
          this.getNoticeList();
        }
      });
    },
    getRegisterDetail() {
      let param = new URLSearchParams();
      param.append("lec_id", this.modalProps);//여기서 lec_id 를 맵퍼파일의 파라미터명과 일치 시켜줘야 한다.

      console.log("getRegisterDetail 호출됨, register_id:", this.modalProps);
      // if(this.modalProps.lecId) {
      //   axios.post("/register/lecInfo.do", param).then((res) => {
      //     this.lecData = res.data.lecinfo;
      //     console.log("lecData:", this.lecData, res.data);
      //   });
      // }
      if(this.modalProps) {
        axios.post("/register/lecInfo.do", param).then((res) => {
          this.lecData = res.data.lecinfo;
          console.log("lecInfo:", this.lecInfo, res.data);
        });
      }

      axios.post("/register/registerListControljson.do", param).then((res) => {
        console.log("서버 응답 데이터:", res.data);
        this.lecrmList = res.data.lecrmList;
        this.tutList = res.data.tutList;
        this.typeList = res.data.typeList;
        console.log("타입리스트 : " + this.typeList)
      });
    },
    

    delRegister() {
      let param = new URLSearchParams();
      param.append("lec_id", this.modalProps);

      axios.post("/register/delRegister.do", param).then((res) => {
        if (res.data.result) {
          alert(res.data.resultMsg);
          this.$emit("closeModal", false);
          this.getRegisterList();
        }
      });
    },
  },
  mounted() {
    console.log("mounted 호출됨, modalProps:", this.modalProps);
    this.getRegisterDetail()
    // this.modalProps ? this.getRegisterDetail() : null;
  },
};
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
</style>
