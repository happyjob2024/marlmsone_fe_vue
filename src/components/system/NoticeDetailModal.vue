<template>
    <div class="container-xxl">
        <div class="row mb-3" v-show="delshow">
            <label for="noticeNo" class="col-sm-3 col-form-label">공지번호</label>
            <div class="col-sm-9">
                <input type="input" class="form-control" readOnly id="noticeNo" />
            </div>
        </div>
        <div class="row mb-3">
            <label for="noticeInput" class="col-sm-3 col-form-label">작성자</label>
            <div class="col-sm-9">
                <input type="input" class="form-control" readOnly />
            </div>
        </div>
        <div class="row mb-3">
            <label for="noticeTitle" class="col-sm-3 col-form-label">제목</label>
            <div class="col-sm-9">
                <input type="input" class="form-control" />
            </div>
        </div>
        <div class="row mb-3">
            <label for="noticeContent" class="col-sm-3 col-form-label">공지내용</label>
            <div class="col-sm-9">
                <textarea rows="5" cols="300" class="form-control" />
            </div>
        </div>
        <div class="float-sm-end mb-3">
            <button type="button" class="btn btn-primary me-2">저장</button>
            <button type="button" class="btn btn-primary me-2">삭제</button>
            <button type="button" class="btn btn-primary">취소</button>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style></style>
