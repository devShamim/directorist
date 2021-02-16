<?php
/**
 * @author  wpWax
 * @since   6.6
 * @version 6.7
 */

if ( ! defined( 'ABSPATH' ) ) exit;
?>

<div class="atbdp_info_module">

	<?php if ( $display_guest_listings && !atbdp_logged_in_user() ): ?>

		<div class="form-group">
			
			<label for="guest_user"><?php echo esc_html( $guest_email_label ); ?>:<span class="atbdp_make_str_red"> *</span></label>

			<input type="text" id="guest_user_email" name="guest_user_email" class="form-control directory_field" placeholder="<?php echo esc_attr( $guest_email_placeholder ); ?>"/>
		</div>

	<?php endif; ?>

	<?php if ( $display_privacy ): ?>

		<div class="atbd_privacy_policy_area">

			<input id="privacy_policy" type="checkbox" name="privacy_policy" <?php checked( $privacy_checked ); ?> <?php echo $privacy_is_required ? 'required="required"' : ''; ?>>

			<label for="privacy_policy"><?php echo wp_kses_post( $listing_form->privacy_label() ); ?></label>

			<?php if ( $privacy_is_required ): ?>
				<span class="atbdp_make_str_red"> *</span>
			<?php endif; ?>

		</div>

	<?php endif; ?>

	<?php if ($display_terms): ?>

		<div class="atbd_term_and_condition_area">

			<input id="listing_t" type="checkbox" name="t_c_check" <?php checked( $terms_checked ); ?> <?php echo $terms_is_required ? 'required="required"' : ''; ?>>

			<label for="listing_t"><?php echo wp_kses_post( $listing_form->terms_label() ); ?></label>

			<?php if ($terms_is_required): ?>
				<span class="atbdp_make_str_red"> *</span>
			<?php endif; ?>

		</div>

	<?php endif; ?>

	<div id="listing_notifier"></div>
	
	<div class="btn_wrap list_submit">
		<button type="submit" class="btn btn-primary btn-lg listing_submit_btn"><?php echo esc_html( $listing_form->submit_label() ); ?></button>
	</div>

</div>