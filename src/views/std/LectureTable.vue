<template>
    <div class="divComGrpCodList">
        <table class="col">
            <caption></caption>
            <colgroup>
                <col width="15%" />
                <col width="10%" />
                <col width="15%" />
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="10%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">강의명</th>
                    <th scope="col">수강대상</th>
                    <th scope="col">강사명</th>
                    <th scope="col">개강일</th>
                    <th scope="col">종강일</th>
                    <th scope="col">수강인원</th>
                    <th scope="col">최대인원</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="dataList">
                    <tr v-for="data in dataList" :key="data.lec_id">
                        <td @click="modalHandler(data.lec_id)">{{ data.lec_name }}</td>
                        <td>{{ data.lec_sort }}</td>
                        <td>{{ data.name }}</td>
                        <td>{{ dayjs(data.start_date).format('YY-MM-DD') }}</td>
                        <td>{{ dayjs(data.end_date).format('YY-MM-DD') }}</td>
                        <td>{{ data.pre_pnum }}</td>
                        <td>{{ data.max_pnum }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="7">일치하는 검색 결과가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <ModalLectureDetail 
            v-if="modalBoolean" 
            :lecture_id="lecture_id"
            @closeModal="modalBoolean = $event"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import ModalLectureDetail from './ModalLectureDetail.vue';

    const modalBoolean = ref(false);
    const lecture_id = ref(0);

    defineProps({
        dataList: Object,
    });

    const modalHandler = (param) => {
        modalBoolean.value = true;
        lecture_id.value = param;
    };

</script>

<style>

</style>