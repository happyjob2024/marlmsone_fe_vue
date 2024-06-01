<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">통계</span>
            <span class="btn_nav bold">수강인원</span>
        </p>
        <p class="conTitle">
            <span class="conNm">수강인원</span>
            <span class="fr">
                <select v-model="selected">
                    <option v-for="option in selectOptions" 
                            :key="option.value" 
                            :value="option.value"
                    > {{ option.text }}
                    </option>
                </select>                
                <input type="text" class="lecure-name" style="margin-left:10px;" v-model="searchWord"/>
                <button class="btn btn-secondary btn-sm" @click="searchTutLecture()">검색</button>
            </span>
        </p>
        <div>
            <div>
                <b> 총건수 : {{ dataTotalCnt }} , 현재 페이지 번호 : {{ currentPage }} </b>
            </div>
        </div>
        <table class="table table-hover" style="margin-top: 1%; text-align: center">
            <colgroup>
                <col width="15%">
                <col width="15%">
                <col width="10%">
                <col width="8%">
                <col width="8%">
                <col width="8%">
                <col width="8%">
                <col width="8%">
                <col width="8%">
            </colgroup>            
            <thead class="table table-hover">
                <tr>
                    <th class="t-header-c">과정명</th>
                    <th class="t-header-c">기간</th>
                    <th class="t-header-c">강사명</th>
                    <th class="t-header-c">과락인원</th>
                    <th class="t-header-c">총점수</th>
                    <th class="t-header-c">평균</th>
                    <th class="t-header-c">최대 점수</th>
                    <th class="t-header-c">최소 점수</th>
                </tr>
            </thead>            
            <tbody>
                <!-- {"totalCnt": 27,"lecList": [{"lec_id": 1,"tutor_id": null,"lec_name": "자바의이해","max_pnum": 51,"pre_pnum": 0,
                                        "start_date": "2024.03.05","end_date": "2024.06.15","process_day": null,"test_id": 0,
                                        "loginID": null,"user_type": null,"use_yn": null,"name": "스티븐잡스","std_id": null,
                                        "test_score": 0,"tot_score": 286,"max_score": 100,"min_score": 43,"avg_score": 71,
                                        "fail_cnt": 2,"fail_rate": 0.0}],"pageSize": 6,"currentPage": 1} -->
                <template v-if="dataTotalCnt > 0">
                    <tr v-for="data in dataList" :key="data.lec_id">
                        <td>{{ data.lec_name }}</td>
                        <td>{{ data.start_date }} ~ {{ data.end_date }}</td>
                        <td>{{ data.name }}</td>                        
                        <td>{{ data.fail_cnt }}</td>                        
                        <td>{{ data.tot_score }}</td>                        
                        <td>{{ data.avg_score }}</td>                        
                        <td>{{ data.max_score }}</td>                        
                        <td>{{ data.min_score }}</td>                        
                        <!-- <td @click="$router.push(`lecturePlanDetail/${data.lec_id}`)">{{ data.lec_name }}</td> -->
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="8">데이터가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            v-bind="{ currentPage, totalItems: dataTotalCnt, itemsPerPage: pageSize }"
            @search="searchLectureList($event)"
            v-if="dataList.length > 0"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { CourseSize } from '@/api/api';
import { axiosAction } from '.';
import Pagination from '@/components/common/PaginationComponent.vue';

const pageSize = 6;
const currentPage = ref(0);

const selected = ref('all');
const selectOptions = ref([
    { text: '전체', value: 'all' },
    { text: '강의명', value: 'lec_name' },
    { text: '강사명', value: 'tutor_name' },
]);
const searchWord = ref('');

const dataList = ref([]);
const dataTotalCnt = ref(0);


// 강의목록 조회
const searchLectureList = async (cpage) => {
    cpage = cpage || 1;

    // var param = {
    //     searchKey : searchKey,
    //     searchWord : searchWord,
    //     currentPage : currentPage,
    //     pageSize : pageSize,
    //     from_date : from_date,
    //     to_date : to_date
    // }
    // callAjax("/adm/selectCourse.do", "post", "text", true, param, resultCallback);

    let param = new URLSearchParams();
    param.append('searchKey', selected.value);
    param.append('searchWord', searchWord.value);
    param.append('currentPage', cpage);
    param.append('pageSize', pageSize);
    param.append('from_date', '');
    param.append('to_date', '');

    const lectureList = await axiosAction(CourseSize.GetLectureList, param);

    // {"totalCnt": 27,"lecList": [{...}],"pageSize": 6,"currentPage": 1}
    if (lectureList) {
        dataList.value = lectureList.lecList;
        dataTotalCnt.value = lectureList.totalCnt;

        currentPage.value = cpage;
    }
};

onMounted(() => {
    searchLectureList();
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
.t-header-c {
    text-align: center;
    font-weight: bold;
}
</style>