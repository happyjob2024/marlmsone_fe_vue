<template>
  <div>
    <p class="Location">
      <span class="btn_nav bold">시설 관리</span>
      <span class="btn_nav bold"> 강의실</span>
    </p>
    <p class="conTitle">
      <span class="conNm">강의실</span>
      <span class="fr">
        <span>강의실 명 </span>
        <input type="text" class="lecure-name" />
        <button class="btn btn-light btn-sm" @click="$router.push(`write`)">강의실 신규등록</button>
        <button class="btn btn-secondary btn-sm">검색</button>
      </span>
    </p>
    <div>
      <b> 총건수 : {{ total }} 현재 페이지 번호 : {{ currentPage }} </b>
    </div>
    <div class="row">
        <CardLecture v-for="data in dataList" 
                    :key="data.lecrm_id" 
                    :data="data"/>
    </div>
    <Pagination 
        v-bind="{currentPage, totalItems: total, itemsPerPage: 6}"
        @search="searchLecture($event)"
        v-if="dataList.length > 0"
        />
  </div>

</template>

<script setup>
    // import axios from "axios";
    import { onMounted, ref } from "vue";
    import CardLecture from './CardLecture.vue';
    import Pagination from "@/components/common/PaginationComponent.vue";
    import { axiosAction } from ".";
    import { SamplePage5 } from "@/api/api";

    const dataList = ref([])
    const total = ref(0);
    const currentPage = ref(1);
    
    const searchLecture = async (cpage) => {
        cpage = cpage || 1;

        // var param = {
        //     searchRoomName : $("#searchRoomName").val(),
        //     cpage : cpage,
        //     pagesize : pagesize,
        // };
        // url : '/adm/lectureRoomList.do',

        let param = new URLSearchParams();
        param.append("cpage", cpage);
        param.append("pagesize", 6);

        // {"listcnt": 32,
        //  "listdata": [{"lecrm_id": 97,"lecrm_name": "111111111","lecrm_size": "111","lecrm_snum": 111,
        //                "lecrm_note": "11111111111111111111111","equ_id": 0,"equ_name": null,"equ_num": 0,"equ_note": null}]}

        // axios.post("/adm/lectureRoomListjson.do", param)
        //     .then((res) => {
        //         dataList.value = res.data.listdata;
        //         total.value = res.data.listcnt;
        //         currentPage.value = cpage;
        //      });
        const lectureList = await axiosAction(SamplePage5.LectureRoomList, param);
        if (lectureList) {
            dataList.value = lectureList.listdata;
            total.value = lectureList.listcnt;
            currentPage.value = cpage;
        }
    };

    onMounted(() => {
        searchLecture();
    });
</script>

<style>
.lecure-name {
  height: 30px;
  border-radius: 5px;
}

.btn-sm {
  margin-left: 10px;
}
</style>
