<template>
    <div id="notice">
        <p class="Location">
            <a href="/dashboard/home" class="btn_set home"></a>
            <span class="btn_nav bold">학습관리</span>
            <span class="btn_nav bold">학습자료</span>
        </p>
        <p class="conTitle">
            <span>학습자료</span>
            <span>
                <select v-model="searchKey">
                    <option value="all" selected="selected">전체</option>
                    <option value="title">제목</option>
                    <option value="lec_name">강의명</option>
                </select>
                <input 
                    type="text"
                    style="width: 200px"
                    v-model="searchInfo"
                >
                <button class="btn btn-primary btn-sm" @click="searchLearningMaterials()">검색</button>
            </span>
        </p>
        <div class="divComGrpCodList">
            <table class="col">
                <caption></caption>
                <colgroup>
                    <col width="15%" />
                    <col width="20%" />
                    <col width="45%" />
                    <col width="20%" />
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">NO</th>
                        <th scope="col">강의명</th>
                        <th scope="col">제목</th>
                        <th scope="col">등록일</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="dataList && dataList.length > 0">
                        <tr v-for="data in dataList" :key="data.learn_data_id">
                            <td>{{ data.learn_data_id }}</td>
                            <td>{{ data.lec_name }}</td>
                            <td @click="modalHandler(data.learn_data_id)">{{ data.learn_con }}</td>
                            <td>{{ data.w_date }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="7">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <Pagination 
            v-bind="{ currentPage, totalItems: listCount, itemsPerPage: 5 }"
            @search="searchLearningMaterials($event)"
            v-if="dataList.length > 0"
        />

        <ModalLearningMaterials 
            v-if="modalBoolean" 
            :learn_data_id="learn_data_id"
            @closeModal="modalBoolean = $event"
        />
    </div>
</template>

<script setup>
import Pagination from '@/components/common/PaginationComponent.vue';
import ModalLearningMaterials from './ModalLearningMaterials.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';

    const dataList = ref([]);
    const listCount = ref(0);
    const currentPage = ref(1);
    const searchKey = ref('all');
    const searchInfo = ref('');
    const modalBoolean = ref(false);
    const learn_data_id = ref(0);

    const searchLearningMaterials = (page) => {
        page = page || 1;
        let param = new URLSearchParams();
        param.append('currentPage', page);
        param.append('pageSize', 5);
        param.append('searchKey', searchKey.value);
        param.append('searchInfo', searchInfo.value);

        axios.post('/std/studentLearnMatList', param).then((res) => {
            dataList.value = res.data.learningMatList;
            listCount.value = res.data.learnMatTotalCount;
            currentPage.value = page;
        });
    };

    const modalHandler = (param) => {
        modalBoolean.value = true;
        learn_data_id.value = param;
    }

    onMounted(() => {
        searchLearningMaterials();
    })

</script>

<style>
    .conTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>