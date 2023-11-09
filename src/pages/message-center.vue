<template>
  <v-card
    class="mx-auto"
    max-width="1050"
  >
    <v-toolbar color="cyan-lighten-1">
      <v-toolbar-title>Message Box</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        variant="text"
        icon="mdi-magnify"
      ></v-btn>
    </v-toolbar>

    <v-list
      :items="items"
      item-props
      lines="three"
    >
      <template v-slot:append>
        <v-btn
          color="grey-lighten-1"
          icon="mdi-information"
          variant="text"
        ></v-btn>
      </template>
    </v-list>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    items: [
      { type: 'subheader', title: 'Advices to solve' },
      {
        title: 'Brunch this weekend?',
        subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
      },
      { type: 'divider', inset: true },
      {
        title: 'Summer BBQ',
        subtitle: `Wish I could come, but I'm out of town this weekend.`,
      },
      { type: 'divider', inset: true },
      {
        title: 'Oui oui',
        subtitle: 'Do you have Paris recommendations? Have you ever been?',
      },
      { type: 'divider', inset: true },
      {
        title: 'Birthday gift',
        subtitle: 'Have any ideas about what we should get Heidi for her birthday?',
      },
      { type: 'divider', inset: true },
      {
        title: 'Recipe to try',
        subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
      },
    ],
  }),
}
</script>
