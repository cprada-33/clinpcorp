<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :item-key="itemKey"
      @click:row="handleRowClick"
      hover
    >
      <!-- Forward all item.* slots to v-data-table -->
      <template
        v-for="(_, name) in $slots"
        :key="name"
        v-slot:[name]="slotData"
      >
        <slot :name="name" v-bind="slotData" />
      </template>

      <!-- Default no-data slot if not provided -->
      <template v-if="!$slots['no-data']" v-slot:no-data>
        <div class="text-center py-8">
          <v-icon
            :icon="emptyIcon"
            size="64"
            class="mb-4 text-medium-emphasis"
          />
          <div class="text-h6 mb-2">{{ emptyTitle }}</div>
          <div class="text-body-2 text-medium-emphasis">
            {{ emptyMessage }}
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
interface Header {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string | number
}

interface Props {
  headers: Header[]
  items: any[]
  loading?: boolean
  itemKey?: string
  emptyIcon?: string
  emptyTitle?: string
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  itemKey: 'id',
  emptyIcon: 'mdi-inbox',
  emptyTitle: 'No data found',
  emptyMessage: 'There are no items to display'
})

const emit = defineEmits<{
  (e: 'row-click', event: any, data: { item: any }): void
}>()

const handleRowClick = (event: any, data: { item: any }) => {
  emit('row-click', event, data)
}
</script>

<style scoped lang="scss">
:deep(.v-data-table tbody tr) {
  cursor: pointer;
}
</style>
