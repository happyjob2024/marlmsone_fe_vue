<template>
  <div>
    <p class="Location">
      <span class="btn_nav bold">학습관리</span>
      <span class="btn_nav bold">학습자료</span>
    </p>
    <p class="conTitle">
      <span class="conNm">학습자료</span>
      <span class="fr">
        <span>강의명 </span>
        <select
          id="searchKey"
          v-model="lectureValue"
          style="width: 150px; margin: 0 5px 5px 0"
        >
          <option v-for="lec in lecList" :key="lec.lec_id" :value="lec.lec_id">
            {{ lec.lec_name }}
          </option>
        </select>
        <button class="btn btn-primary mx-2" @click="getSearchLearnMatList()">
          검색
        </button>
        <button class="btn btn-primary mx-2" @click="fileModalHandler()">
          학습자료 등록
        </button>
      </span>
    </p>
    <div>
      <div>
        <b>
          총건수 : {{ totalItems }} , 현재 페이지 번호 : {{ currentPage }}
        </b>
      </div>
    </div>
    <div class="divComGrpCodList">
      <div style="float: left"></div>
      <table class="col" style="margin-bottom: 10px">
        <colgroup>
          <col width="15%" />
          <col width="50%" />
          <col width="35%" />
        </colgroup>

        <thead>
          <tr style="border: 0px; border-color: blue">
            <th scope="col">NO</th>
            <th scope="col">제목</th>
            <th scope="col">등록일</th>
          </tr>
        </thead>
        <tbody id="listMat">
          <template v-if="lectureValue == null">
            <tr>
              <td colspan="3">강의명을 선택해 주세요</td>
            </tr>
          </template>
          <template v-else-if="learningMatList.length > 0">
            <tr v-for="list in learningMatList" :key="list.learn_data_id">
              <td>{{ list.learn_data_id }}</td>
              <td>
                <a
                  class="pointer"
                  style="text-decoration: none; color: blue"
                  @click="detailModalHandler(list.learn_data_id)"
                  >{{ list.learnTitle }}</a
                >
              </td>
              <td>{{ formatDate(list.writeDate) }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="3">데이터가 존재하지 않습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Pagination
        :currentPage="currentPage"
        :totalItems="totalItems"
        @search="getLectureList($event)"
        v-if="totalItems > 0"
      />
    </div>
    <FileUploadModal
      v-if="fileModalState"
      @closeModal="fileModalState = false"
      :getSearchLearnMatList="getSearchLearnMatList"
      :currentPage="currentPage"
    />
    <DetailModal
      v-if="detailModalState"
      @closeModal="detailModalState = false"
      :getSearchLearnMatList="getSearchLearnMatList"
      :detailModalProps="detailModalProps"
      :currentPage="currentPage"
    />
  </div>
</template>

<script>
import Pagination from "@/components/common/PaginationComponent.vue";
import FileUploadModal from "./FileUploadModal.vue";
import DetailModal from "./DetailModal.vue";
import axios from "axios";

export default {
  data() {
    return {
      lectureList: [],
      learningMatList: [],
      lecList: [],
      currentPage: 0,
      totalItems: 0,
      fileModalState: false,
      detailModalState: false,
      detailModalProps: 0,
      lectureValue: null,
    };
  },

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date));
    },

    getLectureList() {
      axios.get("/tut/t_learningMaterialsReact").then((res) => {
        this.lecList = res.data.lectureList;
      });
    },

    getSearchLearnMatList(currentPage) {
      currentPage = currentPage || 1;

      const tutorId = sessionStorage.getItem("loginId");

      let param = new URLSearchParams();
      param.append("tutorId", tutorId);
      param.append("lectureValue", document.getElementById("searchKey").value);
      param.append("currentPage", currentPage);
      param.append("pageSize", 10);
      axios.post("/tut/tutorLearnMatListReact", param).then((res) => {
        this.learningMatList = res.data.learningMatList;
        this.currentPage = currentPage;
        this.totalItems = res.data.totalCount;
      });
    },
    fileModalHandler() {
      this.fileModalState = true;
    },
    detailModalHandler(learnDataId) {
      this.detailModalState = true;
      this.detailModalProps = learnDataId;
    },
  },
  mounted() {
    this.getLectureList();
  },
  components: { Pagination, FileUploadModal, DetailModal },
};
</script>

<style>
a.pointer {
  cursor: pointer;
}
</style>
