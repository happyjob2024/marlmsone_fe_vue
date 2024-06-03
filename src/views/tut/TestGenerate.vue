<template>
    <div>
        <p class="Location">
            <a href="/dashboard/home" class="btn_set home"></a>
            <span class="btn_nav bold">학습관리</span>
            <span class="btn_nav bold">시험출제</span>
        </p>
        <p class="conTitle">
            <span>시험출제 목록</span>
            <span class="fr">
                <select id="searchKey" name="searchKey" style="width: 130px;" @change="fSearch_tutLecList()">
                    <option id="option1" value="AllTest" selected="selected">전체 강의목록</option>
                    <option id="option1" value="ProceedingTest">진행중인 강의</option>
                    <option id="option1" value="LastTest">종료된 강의</option>
                </select>
            </span>
        </p>
        <div class="divList">
            <table class="col">
                <caption>caption</caption>
                <colgroup>
                    <col width="30%">
                    <col width="20%">
                    <col width="30%">
                    <col width="20%">
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">강의명</th>
                        <th scope="col">강의분류</th>
                        <th scope="col">강의기간</th>
                        <th scope="col">시험문제</th>
                    </tr>
                </thead>
                <tbody id="tutTestListBody">
                    <tr v-for="(data, i) in dataList" :key="i">
                        <td>{{ data.lec_name }}</td>
                        <td>{{ data.lec_type_id }}</td>
                        <td>{{ dayjs(data.start_date).format('YYYY-MM-DD') }} ~ {{
                            dayjs(data.end_date).format('YYYY-MM-DD') }}</td>
                        <td v-if="data.test_id == 0"><a class="btnType blue"
                                @click="fPopModal_generateTest(data)"><span>시험문제
                                    출제</span></a></td>
                        <td v-else><a @click="fView_testDetail(data)"><span>시험문제 보기</span></a></td>
                    </tr>

                </tbody>
            </table>
            <Pagination v-bind="{ currentPage, totalItems: total, itemsPerPage: 5 }"
                @search="fSearch_tutLecList($event)" v-if="dataList.length > 0" />
            <ModalTestGenerate v-if="gModalBoolean" @closeModal="gModalBoolean = $event" :testData="testData"
                @closeAndGenerate="closeModal" />
            <ModalTestDetail v-if="dModalBoolean" @closeModal="dModalBoolean = $event" :testData="testData"/>

        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import Pagination from "../../components/common/PaginationComponent.vue";
import ModalTestGenerate from "./ModalTestGenerate.vue";
import ModalTestDetail from "./ModalTestDetail.vue";


const dataList = ref([]);
const total = ref(0);
const currentPage = ref(0);
const gModalBoolean = ref(false);
const dModalBoolean = ref(false);
const testData = ref({});

const fSearch_tutLecList = (cpage) => {
    cpage = cpage || 1;
    let param = new URLSearchParams();
    param.append("cpage", cpage);
    param.append("pagesize", 5);
    param.append("searchKey", document.getElementById('searchKey').value);

    axios.post('/tut/tutTestJsonList.do', param).then((res) => {
        dataList.value = res.data.listdata;
        total.value = res.data.listcnt;
        currentPage.value = cpage;
    });
};

const fPopModal_generateTest = (data) => {
    gModalBoolean.value = true;
    testData.value = data;
};

const fView_testDetail = (data) => {
    dModalBoolean.value = true;
    testData.value = data;
};

const closeModal = () => {
    gModalBoolean.value = false;
    dModalBoolean.value = false;
    fSearch_tutLecList();
};

onMounted(() => {
    fSearch_tutLecList();
});
</script>

<style></style>