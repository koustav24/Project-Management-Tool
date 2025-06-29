import { Grid, Skeleton, Stack } from "@mui/material"

export const LayoutLoader=()=>{
  return(
    <>
      <Grid container height={"100%"}>
      <Grid item xs={12}>

        <Stack direction={'column'} gap={2} >
          {
            Array.from({length:10}).map((_,index)=>(
              <Skeleton key={index} variant="rectangular" height="3rem" />
            ))
          }
        </Stack>

      </Grid>
      

      </Grid>
    </>
    )
}