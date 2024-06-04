<script setup>
import Pagination from '@/components/common/PaginationComponent.vue';
import SaveEmployModal from '@/components/modals/employ/SaveEmployModal.vue';
import { Employ } from '@/api/api';
import { EmptyEmploy } from '@/common/models/Employ';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const emptyEmploy = {
    action: 'I',
    ...EmptyEmploy,
};

const emit = defineEmits(['doAction']);

const pageSize = 5;
const currentPage = ref(1);
const totalCount = ref(0);

const saveEmploy = ref(emptyEmploy);
const saveModalFlag = ref(false);

const searchValue = ref('');
const searchKey = ref('all1');
const list = ref([]);

const searchList = (page) => {
    page = page || 1;

    const params = new URLSearchParams();
    params.append('currentPage', page);
    params.append('pageSize', pageSize);
    params.append('searchInfo1', searchValue.value);
    params.append('searchKey1', searchKey.value);

    axios
        .post(Employ.GetStudents, params)
        .then((res) => {
            list.value = res.data.stdList;
            totalCount.value = res.data.std_Total;
            currentPage.value = page;
        })
        .catch((_) => {
            alert('실패했습니다.');
        });
};

const openSaveModal = (employ) => {
    saveEmploy.value = {
        action: 'I',
        id: employ.std_id,
        name: employ.name,
        company: employ.comp_name,
        tel: employ.tel,
        startDate: employ.employ_day,
        endDate: employ.resign_day,
    };
    saveModalFlag.value = true;
};

const closeSaveModal = (data) => {
    saveEmploy.value = emptyEmploy;
    saveModalFlag.value = false;

    if (data) {
        emit('doAction');
        searchList();
    }
};

defineExpose({ searchList });

onMounted(() => {
    searchList();
});
</script>

<template>
    <div style="margin-top: 10px">
        <p class="conTitle">
            <span>학생 정보</span>
            <span class="search">
                <select class="form-select" v-model="searchKey">
                    <option value="all1">전체</option>
                    <option value="t_name">학생명</option>
                    <option value="lec_nm">강의명</option>
                </select>
                <input type="text" class="form-control" v-model="searchValue" />
                <button class="btn btn-primary" @click="searchList()">
                    검색
                </button>
            </span>
        </p>
        <table class="col">
            <colgroup>
                <col width="10%" />
                <col width="10%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="10%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">학번</th>
                    <th scope="col">학생명</th>
                    <th scope="col">연락처</th>
                    <th scope="col">강의명</th>
                    <th scope="col">가입일자</th>
                    <th scope="col">등록</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!list.length">
                    <td colSpan="6">해당되는 데이터가 없습니다.</td>
                </tr>
                <tr v-for="item in list" :key="item.std_id">
                    <td>{{ item.std_num }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.tel }}</td>
                    <td>{{ item.lec_name }}</td>
                    <td>{{ item.join_date }}</td>
                    <td>
                        <button
                            class="btn btn-primary"
                            @click="openSaveModal(item)"
                        >
                            등록
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination
            v-bind="{
                currentPage,
                totalItems: totalCount,
                itemsPerPage: pageSize,
            }"
            @search="searchList($event)"
            v-if="list.length > 0"
            style="margin: 15px 0 30px 0"
        />
        <SaveEmployModal
            v-if="saveModalFlag"
            :info="saveEmploy"
            @closeModal="closeSaveModal"
        />
    </div>
</template>

<style scoped>
.btn {
    padding: 6px;
    font-size: 15px;
}
</style>
