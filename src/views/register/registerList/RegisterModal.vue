<template>
  <teleport to="body">
    <!-- 원흉 1 백드랍에서 모달오버레이로 변경 -->
      <div class="modal-overlay">
          <div class="container" style="width: 500px">
            <!-- 원흉2 모달다이얼로그 삭제 -->
              <div >
                  <div class="modal-content">
                      <div class="modal-header">
                          <p class="conTitle">
                            <span v-if="modalProps">강의 수정</span>
                            <span v-if="!modalProps">강의 등록</span>
                          </p>
                      </div>
                      <!-- 모달바디 삭제 -->
                      <div>
                        <!-- <input type="hidden" id="action" name="action" v-model="lecData.action" />  -->
                          <div class="input-group mb-3">
                              <span class="input-group-text">강의 명</span>
                              <input type="text" class="form-control" v-model="lecData.lec_name" />
                          </div>
                          <div class="input-group mb-3">
                          <label class="input-group-text" for="inputGroupSelect01">강의 분류</label>    
                <select class="form-select" name="lec_type_id" id="lec_type_id" v-model="lecData.lec_type_id" >
                <option value="undefined">강의 분류 선택</option>
                <option v-for="(list, i) in typeList" :key="i" :value="list.lec_type_id">{{ list.lec_type_name }}</option>
              </select>
            </div>
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
                          <div class="input-group mb-3">
                            <label class="input-group-text" for="inputGroupSelect01">강사 선택</label>    
                <select class="form-select" name="tutor_id" id="tutor_id" v-model="lecData.tutor_id" >
                <option value="undefined" id="">강사 선택</option>
                <option v-for="(list, i) in tutList" :key="i" :value="list.tutor_id">{{ list.t_name }}</option>
              </select>
              </div>
                          <!-- <div class="input-group mb-3">
                              <span class="input-group-text">강의실 선택</span>
                              <input type="text" class="form-control"  v-model="lecData.lecrm_id"/>
                          </div> -->
                          <div class="input-group mb-3">
                            <label class="input-group-text" for="inputGroupSelect01">강의실 선택</label>        
                <select class="form-select" name="lecrm_name" id="lecrm_name" v-model="lecData.lecrm_id" >
                <option value="undefined" id="">강의실 선택</option>
                <option v-for="(list, i) in lecrmList" :key="i" :value="list.lecrm_id">{{ list.lecrm_name }}</option>
              </select>
                          </div>
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
      lecrmList: [],
      tutList: [],
      typeList: [],
    };
  },

  methods: {
    insertRegisterDetail(action) {
      let param = new URLSearchParams(this.lecData);
      console.log(this.lecData)
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


      if(this.modalProps) {
        axios.post("/register/lecInfo.do", param).then((res) => {
          this.lecData = res.data.lecinfo;
        });
      }

      axios.post("/register/registerListControljson.do", param).then((res) => {
        this.lecrmList = res.data.lecrmList;
        this.tutList = res.data.tutList;
        this.typeList = res.data.typeList;
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
