import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.json()
    console.log('Submitting application')

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate temp ID
    const tempId = crypto.randomUUID()

    // Validate and sanitize date fields
    if (!formData.dob || formData.dob.trim() === '') {
      throw new Error('Date of birth is required')
    }

    // Convert empty move-in date to null
    const moveInDate = formData.moveInDate && formData.moveInDate.trim() !== '' 
      ? formData.moveInDate 
      : null

    // Insert application
    const { data: application, error: insertError } = await supabaseClient
      .from('applications')
      .insert({
        temp_id: tempId,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        dob: formData.dob,
        num_applicants: formData.numApplicants,
        pets: formData.pets,
        co_applicant: formData.coApplicantFirst && formData.coApplicantLast 
          ? `${formData.coApplicantFirst} ${formData.coApplicantLast}` 
          : null,
        move_in_date: moveInDate,
        property_address: formData.propertyAddress,
        ssn_encrypted: formData.ssn, // Will be encrypted on client
        income: parseFloat(formData.income),
        deposit_amount: parseFloat(formData.depositAmount),
        payment_method: 'bitcoin',
        payment_provider: 'btcpay',
        owner_rating: formData.ownerRating,
        payment_status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting application:', insertError)
      throw insertError
    }

    console.log('Created application:', application.id)

    // Handle document uploads if provided
    if (formData.idFront && typeof formData.idFront === 'string' && formData.idFront.includes(',')) {
      try {
        const idFrontBuffer = Uint8Array.from(atob(formData.idFront.split(',')[1]), c => c.charCodeAt(0))
        const { error: uploadError } = await supabaseClient.storage
          .from('ids')
          .upload(`${application.id}/front.jpg`, idFrontBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading ID front:', uploadError)
        }
      } catch (error) {
        console.error('Error processing ID front:', error)
      }
    }

    if (formData.idBack && typeof formData.idBack === 'string' && formData.idBack.includes(',')) {
      try {
        const idBackBuffer = Uint8Array.from(atob(formData.idBack.split(',')[1]), c => c.charCodeAt(0))
        const { error: uploadError } = await supabaseClient.storage
          .from('ids')
          .upload(`${application.id}/back.jpg`, idBackBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading ID back:', uploadError)
        }
      } catch (error) {
        console.error('Error processing ID back:', error)
      }
    }

    // Handle face image if provided
    if (formData.faceImage && typeof formData.faceImage === 'string' && formData.faceImage.includes(',')) {
      try {
        const faceBuffer = Uint8Array.from(atob(formData.faceImage.split(',')[1]), c => c.charCodeAt(0))
        const { error: uploadError } = await supabaseClient.storage
          .from('faces')
          .upload(`${application.id}/face.jpg`, faceBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading face image:', uploadError)
        } else {
          // Update application with face image URL
          const { data: { publicUrl } } = supabaseClient.storage
            .from('faces')
            .getPublicUrl(`${application.id}/face.jpg`)

          await supabaseClient
            .from('applications')
            .update({ face_image_url: publicUrl })
            .eq('id', application.id)
        }
      } catch (error) {
        console.error('Error processing face image:', error)
      }
    }

    return new Response(
      JSON.stringify({ 
        tempId,
        applicationId: application.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in submit-application:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})